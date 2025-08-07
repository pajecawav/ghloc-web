import dayjs from "dayjs/esm";
import relativeTime from "dayjs/esm/plugin/relativeTime";

import { Endpoints } from "@octokit/types";
import { $fetch } from "ofetch";
import { cachedApiFunction } from "../cache";
import { toast } from "../toasts/toasts";
import { isClient, sleep } from "../utils";
import { getRawGitHubFileUrl } from "./utils";

dayjs.extend(relativeTime);

const createClientFetcher = () => {
	return $fetch.create({
		async onResponseError(error) {
			if (error.response?.status === 403) {
				const limit = parseInt(error.response.headers.get("x-ratelimit-remaining")!, 10);
				const reset = parseInt(error.response.headers.get("x-ratelimit-reset")!, 10) * 1000;

				if (limit === 0) {
					toast.show({
						id: "github-api-limit",
						type: "error",
						content: `GitHub API limit reached. Reset ${dayjs().to(reset)}.`,
					});
				}
			}
		},
	});
};

const createServerFetcher = () => {
	return $fetch.create({
		retry: 0,
		async onRequest({ options }) {
			const token = import.meta.env.NITRO_GITHUB_TOKEN;

			if (token) {
				options.headers.append("Authorization", `token ${token}`);
			}
		},
	});
};

const fetcher = isClient ? createClientFetcher() : createServerFetcher();

export type GHApiGetRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export type GHApiGetRepoHealthResponse =
	Endpoints["GET /repos/{owner}/{repo}/community/profile"]["response"]["data"];

export type GHApiGetCommitActivityResponse =
	Endpoints["GET /repos/{owner}/{repo}/stats/commit_activity"]["response"]["data"];

export type GHApiSearchReposResponse = Endpoints["GET /search/repositories"]["response"]["data"];

export type GHApiGetReposResponse = Endpoints["GET /users/{username}/repos"]["response"]["data"];

export const ghApi = {
	getRepo: cachedApiFunction("ghApi.getRepo", (owner: string, repo: string) => {
		return fetcher<GHApiGetRepoResponse>(`https://api.github.com/repos/${owner}/${repo}`);
	}),

	getRepoHealth: cachedApiFunction("ghApi.getRepoHealth", (owner: string, repo: string) => {
		return fetcher<GHApiGetRepoHealthResponse>(
			`https://api.github.com/repos/${owner}/${repo}/community/profile`,
		);
	}),

	getFile: cachedApiFunction(
		"ghApi.getFile",
		(owner: string, repo: string, path: string, branch: string) => {
			return $fetch(getRawGitHubFileUrl(owner, repo, branch, path), {
				responseType: "text",
			});
		},
	),

	getFileMeta: cachedApiFunction(
		"ghApi.getFile",
		async (owner: string, repo: string, path: string, branch: string) => {
			const url = getRawGitHubFileUrl(owner, repo, branch, path);

			const response = await $fetch.raw(url, { method: "HEAD" });

			const contentType = response.headers.get("content-type")!;
			const contentLength = response.headers.get("content-length");
			const size = contentLength ? parseInt(contentLength, 10) : 0;

			let type: "image" | "text" | null = null;
			if (contentType.startsWith("text/plain")) {
				type = "text";
			} else if (contentType.startsWith("image/")) {
				type = "image";
			}

			return { type, size };
		},
	),

	getCommitActivity: cachedApiFunction(
		"ghApi.getCommitActivity",
		async (owner: string, repo: string) => {
			const clean = (result: GHApiGetCommitActivityResponse | undefined) => {
				return result && Array.isArray(result) ? result : null;
			};

			const request = async () => {
				const result = await $fetch.raw<GHApiGetCommitActivityResponse>(
					`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
				);

				if (isClient && result.status === 202) {
					await sleep(7500);
					return request();
				}

				return clean(result._data);
			};

			return request();
		},
	),

	searchRepos: cachedApiFunction("ghApi.searchRepos", async (query: string, perPage = 10) => {
		return fetcher<GHApiSearchReposResponse>("https://api.github.com/search/repositories", {
			params: { q: query, per_page: perPage },
		});
	}),

	getRepos: cachedApiFunction("ghApi.getRepos", async (owner: string, limit = 3 * 20) => {
		return fetcher<GHApiGetReposResponse>(`https://api.github.com/users/${owner}/repos`, {
			params: { per_page: limit, sort: "updated" },
		});
	}),
};
