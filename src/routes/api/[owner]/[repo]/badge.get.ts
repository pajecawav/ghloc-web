import { HTTPError } from "nitro/h3";
import { defineHandler, getQuery, getRouterParams, setHeader, withServerTiming } from "nitro/h3";
import { humanize } from "~/lib/format";
import { ghlocApi, type Locs } from "~/lib/ghloc/api";
import { ghApi } from "~/lib/github/api";

export default defineHandler(async event => {
	const { owner, repo } = getRouterParams(event);
	let { branch, filter, format } = getQuery<{
		branch?: string;
		filter?: string;
		format?: string;
	}>(event);

	let locs: Locs;
	try {
		if (!branch) {
			branch = (await withServerTiming(event, "branch", () => ghApi.getRepo(owner, repo)))
				.default_branch;
		}

		locs = await withServerTiming(event, "locs", () =>
			ghlocApi.getLocs({ owner, repo, branch, filter }),
		);
	} catch (e) {
		console.error("Failed to fetch locs", e);
		throw new HTTPError({ statusCode: 500, statusMessage: "Failed to fetch locs" });
	}

	setHeader(event, "cache-control", "public, max-age=60");

	return {
		schemaVersion: 1,
		label: "lines",
		message: format === "human" ? humanize(locs.loc) : locs.loc.toString(),
		cacheSeconds: 15 * 60,
	};
});
