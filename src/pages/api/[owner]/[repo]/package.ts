import { getPackageInfo } from "@/lib/package";
import { NextRequest } from "next/server";
import { ServerTiming } from "tiny-server-timing";

export const config = {
	runtime: "edge",
};

export default async function handler(req: NextRequest) {
	if (req.method !== "GET") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	const { searchParams } = new URL(req.url);
	const owner = searchParams.get("owner")!;
	const repo = searchParams.get("repo")!;
	const branch = searchParams.get("branch");

	if (!branch) {
		return new Response("Bad Request", { status: 400 });
	}

	try {
		const timing = new ServerTiming({ precision: 0 });
		const data = await getPackageInfo({ owner, repo, branch }, timing);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"content-type": "application/json",
				"cache-control": "public, max-age=600",
				...timing.getHeaders(),
			},
		});
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
