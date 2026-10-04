import { definePage } from "@pajecawav/yamf";
import { HTTPError, getQuery, withServerTiming } from "nitro/h3";
import { FetchError } from "ofetch";
import { humanize, formatNumber } from "~/lib/format";
import { type Locs, getGhlocGetLocsUrl } from "~/lib/ghloc/api";
import { ghApi, type GHApiGetRepoResponse } from "~/lib/github/api";
import { getLanguageFromExtension } from "~/lib/languages";
import { locMetaToLocs, resolveLocMeta, type RepoLocMeta } from "~/lib/loc-meta";
import { buildPageTitle } from "~/lib/title";
import { CommitsSection } from "./components/CommitsSection";
import { HealthSection } from "./components/HealthSection";
import { InfoSection } from "./components/InfoSection";
import LocsSection from "./components/LocsSection/LocsSection.island";
import { PackageSection } from "./components/PackageSection";
import type { CommonSectionProps } from "./types";

const MAX_DESCRIPTION_LENGTH = 170;

export default definePage({
	cache: {
		maxAge: 60,
		swr: 7 * 24 * 60 * 60,
	},
	render: async (event: any, { head }: any) => {
		const owner = event.context.params?.owner;
		const repo = event.context.params?.repo;
		const { branch: branchParam, filter } = getQuery(event) as {
			branch?: string;
			filter?: string;
		};

		if (!owner || !repo) {
			throw new HTTPError({ statusCode: 400, statusMessage: "Missing owner or repo" });
		}

		let data: GHApiGetRepoResponse | null = null;

		try {
			data = await withServerTiming(event, "repo", () => ghApi.getRepo(owner, repo));
		} catch (error) {
			if (error instanceof FetchError && error.statusCode === 404) {
				throw new HTTPError({ statusCode: 404, statusMessage: "Repo not found" });
			}

			console.error("Failed to fetch repo:", error);
		}

		// no redirect to ?branch=…: serve the canonical URL directly with the
		// default branch resolved server-side (consolidates SEO signals)
		const branch = branchParam ?? data?.default_branch;

		if (!branch) {
			throw new HTTPError({
				statusCode: 500,
				statusMessage: "Failed to fetch repo",
			});
		}

		const locMeta = await withServerTiming(event, "locs-meta", () =>
			resolveLocMeta({ owner, repo, branch, filter }),
		);

		const title = buildRepoTitle(owner, repo, locMeta);
		const description = buildRepoDescription(owner, repo, data, locMeta);
		const canonical = `${event.url.origin}/${owner}/${repo}`;
		const ownerUrl = `${event.url.origin}/${owner}`;

		head.push({
			title,
			meta: [
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{
					property: "og:image",
					content: `${event.url.origin}/api/${owner}/${repo}/og-image?branch=${encodeURIComponent(branch)}`,
				},
				{ property: "og:image:width", content: "1200" },
				{ property: "og:image:height", content: "630" },
			],
			script: [
				{
					type: "application/ld+json",
					innerHTML: JSON.stringify(
						buildJsonLd({
							owner,
							repo,
							data,
							locMeta,
							canonical,
							ownerUrl,
							description,
						}),
					),
				},
			],
			link: [
				{
					rel: "preload",
					href: getGhlocGetLocsUrl({ owner, repo, branch, filter }).toString(),
					as: "fetch",
					crossorigin: "anonymous",
				},
			],
		});

		return (
			<RepoPage
				owner={owner}
				repo={repo}
				branch={branch}
				data={data}
				initialLocs={locMeta && !filter ? locMetaToLocs(locMeta) : null}
			/>
		);
	},
});

const buildRepoTitle = (owner: string, repo: string, locMeta: RepoLocMeta | null) => {
	if (locMeta) {
		return buildPageTitle(`${owner}/${repo}: ${humanize(locMeta.loc)} lines of code`);
	}

	return buildPageTitle(`${owner}/${repo} lines of code`);
};

const getTopLanguages = (locMeta: RepoLocMeta): string[] => {
	const entries = Object.entries(locMeta.langs).toSorted(([, a], [, b]) => b - a);
	const total = entries.reduce((sum, [, loc]) => sum + loc, 0) || 1;

	return entries.slice(0, 3).map(([extension, loc]) => {
		const language = getLanguageFromExtension(extension) ?? extension;
		return `${language} ${Math.round((100 * loc) / total)}%`;
	});
};

const buildRepoDescription = (
	owner: string,
	repo: string,
	data: GHApiGetRepoResponse | null,
	locMeta: RepoLocMeta | null,
) => {
	if (locMeta) {
		const languages = getTopLanguages(locMeta);
		const stats = `${owner}/${repo} has ${formatNumber(locMeta.loc)} lines of code: ${languages.join(", ")}.`;
		const repoDescription = data?.description?.trim();

		if (repoDescription) {
			const room = MAX_DESCRIPTION_LENGTH - stats.length - 1;

			if (repoDescription.length > room) {
				return `${repoDescription.slice(0, Math.max(0, room - 1)).trimEnd()}… ${stats}`;
			}

			return `${repoDescription} ${stats}`;
		}

		return stats;
	}

	const repoDescription = data?.description?.trim();

	if (repoDescription) {
		return repoDescription.slice(0, MAX_DESCRIPTION_LENGTH);
	}

	return `Lines of code by language, file tree, repo size and commit activity of the ${owner}/${repo} GitHub repository.`;
};

interface BuildJsonLdParams {
	owner: string;
	repo: string;
	data: GHApiGetRepoResponse | null;
	locMeta: RepoLocMeta | null;
	canonical: string;
	ownerUrl: string;
	description: string;
}

const buildJsonLd = ({
	owner,
	repo,
	data,
	locMeta,
	canonical,
	ownerUrl,
	description,
}: BuildJsonLdParams) => {
	const programmingLanguage = locMeta
		? Object.entries(locMeta.langs)
				.toSorted(([, a], [, b]) => b - a)
				.slice(0, 5)
				.map(([extension]) => getLanguageFromExtension(extension) ?? extension)
		: data?.language
			? [data.language]
			: undefined;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "SoftwareSourceCode",
				name: `${owner}/${repo}`,
				description,
				codeRepository: `https://github.com/${owner}/${repo}`,
				url: canonical,
				...(programmingLanguage && { programmingLanguage }),
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: owner, item: ownerUrl },
					{ "@type": "ListItem", position: 2, name: repo, item: canonical },
				],
			},
		],
	};
};

interface RepoPageProps extends CommonSectionProps {
	branch: string;
	initialLocs: Locs | null;
}

export const RepoPage = (props: RepoPageProps) => {
	return (
		<div class="flex flex-col gap-2">
			<InfoSection {...props} />

			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				<HealthSection {...props} />

				<PackageSection {...props} />
			</div>

			<CommitsSection {...props} />

			<LocsSection {...props} />
		</div>
	);
};
