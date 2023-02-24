import { GetServerSidePropsContext, NextApiRequest } from "next";

type Request = GetServerSidePropsContext["req"];

export function extractGitHubToken(req: Request): string | null {
	return req.cookies.token ?? process.env.GITHUB_TOKEN ?? null;
}
