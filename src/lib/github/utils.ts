export const getRawGitHubFileUrl = (owner: string, repo: string, branch: string, path: string) => {
	return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
};

export const getGitHubFileUrl = (owner: string, repo: string, branch: string, path: string) => {
	return `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
};
