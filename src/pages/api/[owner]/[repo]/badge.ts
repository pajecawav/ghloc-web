import { getLocs } from "@/lib/locs";
import { NextRequest } from "next/server";

export const config = {
	runtime: "edge",
};

export default async function handler(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const owner = searchParams.get("owner")!;
	const repo = searchParams.get("repo")!;
	const branch = searchParams.get("branch");

	if (!branch) {
		return new Response("Bad Request", { status: 400 });
	}

	try {
		const locs = await getLocs({ owner, repo, branch });
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
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
