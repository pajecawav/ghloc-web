import { $fetch } from "ofetch";
import { cachedApiFunction } from "../cache";

export type LocsChild = Locs | number;

export interface Locs {
	loc: number;
	locByLangs?: Record<string, number>;
	children?: Record<string, LocsChild>;
}

export type GhlocApiGetLocsResponse = Locs;

export interface GhlocApiGetLocsParams {
	owner: string;
	repo: string;
	branch?: string;
	filter?: string;
}

export const ghlocApi = {
	getLocs: cachedApiFunction(
		"ghlocApi.getLocs",
		({ owner, repo, branch, filter }: GhlocApiGetLocsParams) => {
			let url = `https://ghloc.ifels.dev/${owner}/${repo}`;

			if (branch) {
				url += `/${branch}`;
			}

			return $fetch<GhlocApiGetLocsResponse>(url, {
				query: {
					...(filter && { match: filter }),
					pretty: false,
				},
			});
		},
	),
};
