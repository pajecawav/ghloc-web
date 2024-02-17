export const queryKeys = {
	repoHealth: ({ owner, repo }: { owner: string; repo: string }) => [
		"repoHealth",
		{ owner, repo },
	],

	packageInfo: ({ owner, repo, branch }: { owner: string; repo: string; branch: string }) => [
		"packageInfo",
		{ owner, repo },
	],

	commitActivity: ({ owner, repo }: { owner: string; repo: string }) => [
		"commitActivity",
		{ owner, repo },
	],

	repo: (repo: string) => ["repo", repo],

	user: (user: string) => ["user", user],

	search: (query: string) => ["search", { query }],

	locs: ({
		owner,
		repo,
		branch,
		filter,
	}: {
		owner: string;
		repo: string;
		branch: string;
		filter: string | null;
	}) => ["locs", { owner, repo, branch, filter }],
};
