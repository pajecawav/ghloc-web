import { getPackageInfo } from "@/lib/package";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).end("Method Not Allowed");
	}

	const { owner, repo, branch } = req.query as Record<string, string>;

	if (!owner || !repo || !branch) {
		return res.status(400).end("Bad Request");
	}

	try {
		const data = await getPackageInfo({ owner, repo, branch });
		res.setHeader("cache-control", "public, max-age=60, s-maxage=60");
		res.json({ data });
	} catch (e) {
		console.error(e);
		return res.status(500).end("Internal Server Error");
	}
}
