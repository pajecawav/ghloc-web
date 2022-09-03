import { NextApiRequest, NextApiResponse } from "next";
import { $fetch, FetchError } from "ohmyfetch";

// NOTE: the actual service is hosted on https://ghloc.bytes.pw but uBlock
// Origin has a rule to block all third-party requests to *.pw so we use this
// API endpoint as a proxy to ghloc.bytes.pw
const GHLOC_BASE_URL = "https://ghloc.bytes.pw";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).end("Method Not Allowed");
	}

	const { owner, repo, branch, ...params } = req.query as Record<
		string,
		string
	>;

	let url = `${GHLOC_BASE_URL}/${owner}/${repo}`;
	if (branch) {
		url += `/${branch}`;
	}

	try {
		const locs = await $fetch(url, { params });
		res.setHeader("cache-control", "public, max-age=300, s-maxage=300");
		res.json(locs);
	} catch (e) {
		if (e instanceof FetchError) {
			res.status(Number(e.response?.status) || 400).end(e.message);
		} else {
			res.status(500).end("Internal Server Error");
		}
	}
}
