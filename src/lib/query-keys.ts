export const queryKeys = {
	repoHealth: (params: { owner: string; repo: string }) => ["repoHealth", params],

	packageInfo: (params: { owner: string; repo: string; branch: string }) => [
		"packageInfo",
		params,
	],

	commitActivity: (params: { owner: string; repo: string }) => ["commitActivity", params],

	repo: (repo: string) => ["repo", repo],

	user: (user: string) => ["user", user],

	search: (query: string) => ["search", { query }],

	locs: (params: { owner: string; repo: string; branch: string; filter: string | null }) => [
		"locs",
		params,
	],
};
