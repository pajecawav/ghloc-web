import { useTokenStore } from "@/stores/useTokenStore";
import { isClient } from "@/utils";
import dayjs from "dayjs";
import { $fetch, createFetchError } from "ohmyfetch";
import toast from "react-hot-toast";

function createClientFetcher() {
	return $fetch.create({
		retry: 0,
		// async onRequest({ options }) {
		// 	options.headers = getGitHubAuthHeaders();
		// },
		async onResponseError(error) {
			if (error.response?.status === 403) {
				const limit = parseInt(
					error.response.headers.get("x-ratelimit-remaining")!,
					10
				);
				const reset =
					parseInt(
						error.response.headers.get("x-ratelimit-reset")!,
						10
					) * 1000;

				// show toast with an error when GitHub API limit is reached
				if (limit === 0) {
					toast.error(
						`GitHub API limit reached. Reset ${dayjs().to(reset)}.`,
						{
							duration: Infinity,
							id: "error_github-limit-reached",
						}
					);
				}
			} else if (error.response?.status === 401) {
				toast.error("Invalid GitHub API token.", {
					duration: Infinity,
					id: "error_github-token-expired",
				});
			}
		},
	});
}

const ghFetcher = isClient() ? createClientFetcher() : $fetch;

export class GitHubActivityCalculationStartedError extends Error {}

function getGitHubAuthHeaders(): Record<string, string> {
	const { token } = useTokenStore.getState();

	if (!token) {
		return {};
	}

	return {
		Authorization: `token ${token}`,
	};
}

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
	return ghFetcher<ReposSearchResponse>(
		"https://api.github.com/search/repositories",
		{
			method: "GET",
			params: { q: query, per_page: perPage },
		}
	);
}

export function getUser(user: string) {
	return ghFetcher<UserResponse>(`https://api.github.com/users/${user}`);
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
	return ghFetcher<ReposResponse>(
		`https://api.github.com/users/${user}/repos`,
		{
			params: { per_page: perPage, page, sort: "updated" },
		}
	);
}

export function getRepo({ owner, repo }: RepoDetails) {
	return ghFetcher<RepoResponse>(
		`https://api.github.com/repos/${owner}/${repo}`
	);
}

export function getCommunityProfile({ owner, repo }: RepoDetails) {
	return ghFetcher<RepoHealthResponse>(
		`https://api.github.com/repos/${owner}/${repo}/community/profile`
	);
}

export async function getCommitActivity({ owner, repo }: RepoDetails) {
	const response = await ghFetcher.raw<CommitActivity>(
		`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`
	);

	if (!response.ok) {
		throw createFetchError("", undefined, response);
	}

	// 202 response status means that GitHub started calculating commit
	// activity and we need to wait for some time before retrying request
	if (response.status === 202) {
		throw new GitHubActivityCalculationStartedError();
	}

	const data = response._data!;

	// remove future dates
	const now = new Date().getTime();
	const lastWeek = data.pop()!;
	const msInDay = 1000 * 60 * 60 * 24;
	lastWeek.days = lastWeek.days.filter((_, index) => {
		const day = lastWeek.week * 1000 + index * msInDay;
		return day <= now;
	});
	if (lastWeek.days.length !== 0) {
		data.push(lastWeek);
	}

	return data;
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
