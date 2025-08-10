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

export const getGhlocGetLocsUrl = ({ owner, repo, branch, filter }: GhlocApiGetLocsParams) => {
	const url = new URL(`https://ghloc.ifels.dev/${owner}/${repo}`);

	if (branch) {
		url.pathname += `/${branch}`;
	}

	if (filter) {
		url.searchParams.set("match", filter);
	}

	url.searchParams.set("pretty", "false");

	return url;
};

export const ghlocApi = {
	getLocs: cachedApiFunction("ghlocApi.getLocs", (params: GhlocApiGetLocsParams) => {
		const url = getGhlocGetLocsUrl(params);

		return $fetch<GhlocApiGetLocsResponse>(url.toString());
	}),
};
