import { getGhlocGetLocsUrl } from "~/lib/ghloc/api";
import { ghApi } from "~/lib/github/api";
import { RepoPage } from "~/pages/repo";
import LocsSection from "~/pages/repo/components/LocsSection/LocsSection.island.lazy";
import { renderPage } from "~/render";

export default defineEventHandler(async event => {
	const { owner, repo } = getRouterParams(event);
	const { branch, filter } = getQuery<{ branch?: string; filter?: string }>(event);

	const { timing } = event.context;

	const data = await timing
		.timeAsync("repo", () => ghApi.getRepo(owner, repo))
		.catch(error => {
			console.error("Failed to fetch repo:", error);
			return null;
		});

	if (!branch) {
		if (!data) {
			throw createError({ statusCode: 500, statusMessage: "Failed to fetch repo" });
		}

		const url = new URL(getRequestURL(event));
		url.searchParams.set("branch", data.default_branch);

		return sendRedirect(event, url.toString());
	}

	setHeader(event, "cache-control", "public, max-age=60");

	return renderPage(<RepoPage owner={owner} repo={repo} branch={branch} data={data} />, {
		event,
		title: `${owner}/${repo}`,
		ogImage: `api/${owner}/${repo}/og-image?branch=${encodeURIComponent(branch)}`,
		preload: [
			{
				href: getGhlocGetLocsUrl({ owner, repo, branch, filter }).toString(),
				as: "fetch",
				crossorigin: "anonymous",
			},
		],
		preloadIslands: [LocsSection],
	});
});
