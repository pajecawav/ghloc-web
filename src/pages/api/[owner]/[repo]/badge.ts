import { getRepo } from "@/lib/github";
import { getLocs, Locs } from "@/lib/locs";
import { NextRequest } from "next/server";

export const config = {
	runtime: "edge",
};

export default async function handler(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const owner = searchParams.get("owner")!;
	const repo = searchParams.get("repo")!;
	let branch = searchParams.get("branch");
	const filter = searchParams.get("filter") ?? undefined;

	let locs: Locs;
	try {
		if (!branch) {
			branch = (await getRepo({ owner, repo })).default_branch;
		}

		locs = await getLocs({ owner, repo, branch, filter });
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}

	return new Response(
		JSON.stringify({
			schemaVersion: 1,
			label: "lines",
			message: locs.loc.toString(),
		}),
		{
			status: 200,
			headers: {
				"content-type": "application/json",
			},
		}
	);
}
