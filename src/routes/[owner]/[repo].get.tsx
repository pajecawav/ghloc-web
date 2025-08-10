import { getGhlocGetLocsUrl } from "~/lib/ghloc/api";
import { ghApi } from "~/lib/github/api";
import { RepoPage } from "~/pages/repo";
import { renderPage } from "~/render";

export default defineEventHandler(async event => {
	const { owner, repo } = getRouterParams(event);
	const { branch, filter } = getQuery<{ branch?: string; filter?: string }>(event);

	if (!branch) {
		const { default_branch } = await ghApi.getRepo(owner, repo);

		const url = new URL(getRequestURL(event));
		url.searchParams.set("branch", default_branch);

		return sendRedirect(event, url.toString());
	}

	setHeader(event, "cache-control", "public, max-age=60");

	return renderPage(<RepoPage owner={owner} repo={repo} branch={branch} />, {
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
	});
});
