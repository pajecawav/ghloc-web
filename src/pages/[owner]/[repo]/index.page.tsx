import { definePage } from "@pajecawav/yamf";
import { HTTPError, getQuery, withServerTiming } from "nitro/h3";
import { FetchError } from "ofetch";
import { getGhlocGetLocsUrl } from "~/lib/ghloc/api";
import { ghApi, type GHApiGetRepoResponse } from "~/lib/github/api";
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

		const canonical = `${event.url.origin}/${owner}/${repo}`;
		const ownerUrl = `${event.url.origin}/${owner}`;
		const title = buildRepoTitle(owner, repo);
		const description = buildRepoDescription(owner, repo, data);

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
							canonical,
							ownerUrl,
							description,
						}),
					),
				},
			],
			// the locs table is a client-side island — preload its API response
			// so the fetch starts alongside the HTML parse
			link: [
				{
					rel: "preload",
					href: getGhlocGetLocsUrl({ owner, repo, branch, filter }).toString(),
					as: "fetch",
					crossorigin: "anonymous",
				},
			],
		});

		return <RepoPage owner={owner} repo={repo} branch={branch} data={data} />;
	},
});

const buildRepoTitle = (owner: string, repo: string) => {
	return buildPageTitle(`${owner}/${repo} lines of code`);
};

const buildRepoDescription = (owner: string, repo: string, data: GHApiGetRepoResponse | null) => {
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
	canonical: string;
	ownerUrl: string;
	description: string;
}

const buildJsonLd = ({
	owner,
	repo,
	data,
	canonical,
	ownerUrl,
	description,
}: BuildJsonLdParams) => {
	const programmingLanguage = data?.language ? [data.language] : undefined;

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
