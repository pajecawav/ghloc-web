import { Endpoints } from "@octokit/types";
import { FetchError } from "ofetch";
import { cachedApiFunction } from "../cache";
import { dayjs } from "../dayjs";
import { baseFetcher } from "../fetcher";
import { toast } from "../toasts/toasts";
import { isClient, sleep } from "../utils";
import { getRawGitHubFileUrl } from "./utils";

const createClientFetcher = () => {
	return baseFetcher.create({
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
	return baseFetcher.create({
		retry: 0,
		async onRequest({ options }) {
			const token = import.meta.env.NITRO_GITHUB_TOKEN;

			if (token) {
				options.headers.append("Authorization", `token ${token}`);
			}
		},
		headers: {
			"User-Agent": "ghloc",
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

type GHApiRepoHealthFile = NonNullable<
	NonNullable<GHApiGetRepoHealthResponse["files"]>["issue_template"]
>;

type GHApiContentItem = {
	name: string;
	type: string;
	url: string;
	html_url: string | null;
};

const issueTemplateFileRegex = /\.(?:md|ya?ml)$/i;
const issueTemplateConfigRegex = /^config\.ya?ml$/i;

const getContents = async (owner: string, repo: string, path: string) => {
	try {
		return await fetcher<GHApiContentItem | GHApiContentItem[]>(
			`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
		);
	} catch (error) {
		if (error instanceof FetchError && error.statusCode === 404) {
			return null;
		}

		throw error;
	}
};

const isIssueTemplateFile = (item: GHApiContentItem) => {
	return (
		item.type === "file" &&
		issueTemplateFileRegex.test(item.name) &&
		!issueTemplateConfigRegex.test(item.name)
	);
};

export const ghApi = {
	getRepo: cachedApiFunction("ghApi.getRepo", (owner: string, repo: string) => {
		return fetcher<GHApiGetRepoResponse>(`https://api.github.com/repos/${owner}/${repo}`);
	}),

	getRepoHealth: cachedApiFunction("ghApi.getRepoHealth", (owner: string, repo: string) => {
		return fetcher<GHApiGetRepoHealthResponse>(
			`https://api.github.com/repos/${owner}/${repo}/community/profile`,
		);
	}),

	getIssueTemplate: cachedApiFunction(
		"ghApi.getIssueTemplate",
		async (owner: string, repo: string): Promise<GHApiRepoHealthFile | null> => {
			const contents = await getContents(owner, repo, ".github/ISSUE_TEMPLATE");

			if (!Array.isArray(contents)) {
				return null;
			}

			const template = contents.find(isIssueTemplateFile);

			if (!template) {
				return null;
			}

			if (!template.html_url) {
				return null;
			}

			return {
				url: template.url,
				html_url: template.html_url,
			};
		},
	),

	getFile: cachedApiFunction(
		"ghApi.getFile",
		async (owner: string, repo: string, path: string, branch: string) => {
			try {
				return await baseFetcher(getRawGitHubFileUrl(owner, repo, branch, path), {
					responseType: "text",
				});
			} catch (error) {
				if (error instanceof FetchError && error.statusCode === 404) {
					return "{}";
				}

				throw error;
			}
		},
	),

	getFileMeta: cachedApiFunction(
		"ghApi.getFileMeta",
		async (owner: string, repo: string, path: string, branch: string) => {
			const url = getRawGitHubFileUrl(owner, repo, branch, path);

			const response = await baseFetcher.raw(url, { method: "HEAD" });

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

			const delayStep = 5_000;
			let delay = 10_000;

			const request = async () => {
				const result = await baseFetcher.raw<GHApiGetCommitActivityResponse>(
					`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
				);

				if (isClient && result.status === 202) {
					await sleep(delay);
					delay += delayStep;

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
