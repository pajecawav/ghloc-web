import { definePage } from "@pajecawav/yamf";
import { HTTPError, HTTPResponse, getQuery, setHeader, withServerTiming } from "nitro/h3";
import { RepoPage } from "~/components/repo";
import { getGhlocGetLocsUrl } from "~/lib/ghloc/api";
import { ghApi } from "~/lib/github/api";
import { buildPageTitle } from "~/lib/title";

export default definePage({
	// @ts-expect-error TS2322: TODO fix types in yamf
	render: async (event: any, { head }: any) => {
		const owner = event.context.params?.owner;
		const repo = event.context.params?.repo;
		const { branch, filter } = getQuery(event) as {
			branch?: string;
			filter?: string;
		};

		if (!owner || !repo) {
			throw new HTTPError({ statusCode: 400, statusMessage: "Missing owner or repo" });
		}

		const data = await withServerTiming(event, "repo", () => ghApi.getRepo(owner, repo)).catch(
			error => {
				console.error("Failed to fetch repo:", error);
				return null;
			},
		);

		if (!branch) {
			if (!data) {
				throw new HTTPError({
					statusCode: 500,
					statusMessage: "Failed to fetch repo",
				});
			}

			const url = new URL(event.url);
			url.searchParams.set("branch", data.default_branch);

			return new HTTPResponse(null, {
				status: 302,
				headers: { location: url.toString() },
			});
		}

		setHeader(event, "cache-control", "public, max-age=60");

		head.push({
			title: buildPageTitle(`${owner}/${repo}`),
			meta: [
				{
					property: "og:image",
					content: `api/${owner}/${repo}/og-image?branch=${encodeURIComponent(branch)}`,
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

		return <RepoPage owner={owner} repo={repo} branch={branch} data={data} />;
	},
});
