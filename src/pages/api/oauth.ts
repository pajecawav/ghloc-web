import { NextApiRequest, NextApiResponse } from "next";

async function exchangeOAuthCode(code: string): Promise<string | null> {
	const params = new URLSearchParams();
	params.set("client_id", process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!);
	params.set("client_secret", process.env.GITHUB_CLIENT_SECRET!);
	params.set("code", code);

	const response = await fetch(
		`https://github.com/login/oauth/access_token?${params.toString()}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
			},
		}
	);

	if (response.ok) {
		const json = await response.json();
		return json.access_token;
	}

	return null;
}

// TODO: figure out why middleware doesn't work on Vercel and replace this with
// middleware (Vercel doesn't set the cookie for some reason)
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const code = req.query.code;

	if (typeof code === "string") {
		const token = await exchangeOAuthCode(code);
		if (token) {
			res.setHeader("Set-Cookie", `token=${token}; path=/; max-age=10`);
		}
	}

	res.redirect("/");
}
