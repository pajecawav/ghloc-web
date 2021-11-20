import { BlockList } from "net";

export type LocsChild = Locs | number;

export type UserType = "User" | "Organization";

export interface Locs {
	loc: number;
	locByLangs: Record<string, number>;
	children?: Record<string, LocsChild>;
}

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
	license: string | null;
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
	license: string | null;
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
