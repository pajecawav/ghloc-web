import { Endpoints } from "@octokit/types";
import { $fetch } from "ofetch";
import { cachedApiFunction } from "../cache";
import { isClient, sleep } from "../utils";
import { getRawGitHubFileUrl } from "./utils";

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

const fetcher = isClient ? $fetch : createServerFetcher();

export type GHApiGetRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export type GHApiGetRepoHealthResponse =
	Endpoints["GET /repos/{owner}/{repo}/community/profile"]["response"]["data"];

export type GHApiGetCommitActivityResponse =
	Endpoints["GET /repos/{owner}/{repo}/stats/commit_activity"]["response"]["data"];

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
};
