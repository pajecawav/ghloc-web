export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export function shouldEnableSsr(): boolean {
	return !!GITHUB_TOKEN;
}
