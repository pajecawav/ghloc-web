import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

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

export async function middleware(req: NextRequest, event: NextFetchEvent) {
	const code = req.nextUrl.searchParams.get("code");

	let token;
	if (code) {
		token = await exchangeOAuthCode(code);
	}

	const res = NextResponse.redirect("/");
	if (token) {
		res.headers.set("set-cookie", `token=${token}; Path=/; Max-Age=10`);
	}

	return res;
}
