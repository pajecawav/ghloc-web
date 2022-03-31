import axios from "axios";

export function getRawGitHubUrl({
	owner,
	repo,
	branch,
	path,
}: {
	owner: string;
	repo: string;
	branch: string;
	path: string;
}) {
	return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

export type RepoDetails = {
	owner: string;
	repo: string;
};

export function searchRepos({
	query,
	perPage = 10,
}: {
	query: string;
	perPage?: number;
}) {
	return axios.get<ReposSearchResponse>(
		"https://api.github.com/search/repositories",
		{
			params: { q: query, per_page: perPage },
		}
	);
}

export function getUser(user: string) {
	return axios.get<UserResponse>(`https://api.github.com/users/${user}`);
}

export function getUserRepos({
	user,
	perPage,
	page,
}: {
	user: string;
	perPage: number;
	page: number;
}) {
	return axios.get<ReposResponse>(
		`https://api.github.com/users/${user}/repos`,
		{
			params: { per_page: perPage, page, sort: "updated" },
		}
	);
}

export function getRepo({ owner, repo }: RepoDetails) {
	return axios.get<RepoResponse>(
		`https://api.github.com/repos/${owner}/${repo}`
	);
}

export function getCommunityProfile({ owner, repo }: RepoDetails) {
	return axios.get<RepoHealthResponse>(
		`https://api.github.com/repos/${owner}/${repo}/community/profile`
	);
}

export function getCommitActivity({ owner, repo }: RepoDetails) {
	return axios.get<CommitActivity>(
		`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
		{
			// treat 202 as an error (indicates that GitHub has started
			// calculating commit activity)
			validateStatus: status =>
				status >= 200 && status < 300 && status !== 202,
		}
	);
}

export type UserType = "User" | "Organization";

export interface UserResponse {
	login: string;
	id: number;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: UserType;
	site_admin: boolean;
	name: string | null;
	company: string | null;
	blog: string;
	location: string | null;
	email: string | null;
	hireable: boolean | null;
	bio: string | null;
	twitter_username: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

export interface RepoResponseLicense {
	key: "other" | string;
	name: string;
	spdx_id: string;
	url: null | string;
}

export interface RepoResponseOwner {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	type: UserType;
	site_admin: boolean;
}

export interface ReposResponseItem {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: RepoResponseOwner;
	html_url: string;
	description: string | null;
	fork: boolean;
	url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string | null;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	forks_count: number;
	mirror_url: string | null;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: RepoResponseLicense | null;
	allow_forking: boolean;
	is_template: boolean;
	topics: string[];
	visibility: "public" | "private";
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
}

export interface ReposResponse extends Array<ReposResponseItem> {}

export interface RepoResponse {
	id: number;
	name: string;
	full_name: string;
	private: boolean;
	owner: RepoResponseOwner;
	html_url: string;
	description: string | null;
	fork: boolean;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string | null;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	forks_count: number;
	mirror_url: string | null;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: RepoResponseLicense | null;
	allow_forking: boolean;
	is_template: boolean;
	topics: string[];
	visibility: "public" | "private";
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
	temp_clone_token: string | null;
	network_count: number;
	subscribers_count: number;
}

export interface CommitActivityEntry {
	total: number;
	week: number;
	days: number[];
}

export interface CommitActivity extends Array<CommitActivityEntry> {}

export interface ReposSearchResponse {
	total_count: number;
	incomplete_results: boolean;
	items: ReposResponseItem[];
}

export interface RepoHealthResponse {
	health_percentage: number;
	description: string | null;
	documentation: string | null;
	files: {
		code_of_conduct: null | {
			key: "other" | string;
			name: string;
			html_url: string;
			url: string;
		};
		code_of_conduct_file: null | {
			url: string;
			html_url: string;
		};
		contributing: {
			url: string;
			html_url: string;
		};
		issue_template: null | {
			url: string;
			html_url: string;
		};
		pull_request_template: null | {
			url: string;
			html_url: string;
		};
		license:
			| null
			| (RepoResponseLicense & {
					html_url: string;
			  });
		readme: null | {
			url: string;
			html_url: string;
		};
	};
	updated_at: string | null;
	content_reports_enabled?: boolean;
}
