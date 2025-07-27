import { createError } from "h3";
import { humanize } from "~/lib/format";
import { ghlocApi, Locs } from "~/lib/ghloc/api";
import { ghApi } from "~/lib/github/api";

export default defineEventHandler(async event => {
	const { owner, repo } = getRouterParams(event);
	// eslint-disable-next-line prefer-const
	let { branch, filter, format } = getQuery<{
		branch?: string;
		filter?: string;
		format?: string;
	}>(event);

	let locs: Locs;
	try {
		if (!branch) {
			branch = (await ghApi.getRepo(owner, repo)).default_branch;
		}

		locs = await ghlocApi.getLocs({ owner, repo, branch, filter });
	} catch (e) {
		console.error("Failed to fetch locs", e);
		throw createError({ statusCode: 500, statusMessage: "Failed to fetch locs" });
	}

	return {
		schemaVersion: 1,
		label: "lines",
		message: format === "human" ? humanize(locs.loc) : locs.loc.toString(),
	};
});
