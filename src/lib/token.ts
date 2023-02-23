import { GetServerSidePropsContext, NextApiRequest } from "next";

type Request = GetServerSidePropsContext["req"];

export function extractGitHubToken(req: Request): string | null {
	const cookieToken = req.cookies.token;

	return cookieToken ?? process.env.GITHUB_TOKEN ?? null;
}
