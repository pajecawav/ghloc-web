export const getRawGitHubFileUrl = (owner: string, repo: string, branch: string, path: string) => {
	return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
};
