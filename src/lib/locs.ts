import { $fetch } from "ofetch";

export type LocsChild = Locs | number;

export interface Locs {
	loc: number;
	locByLangs: Record<string, number>;
	children?: Record<string, LocsChild>;
}

export function getLocs({
	owner,
	repo,
	branch,
	filter,
}: {
	owner: string;
	repo: string;
	branch?: string;
	filter?: string;
}) {
	let url = `https://ghloc.ifels.dev/${owner}/${repo}`;
	if (branch) {
		url += `/${encodeURIComponent(branch)}`;
	}

	return $fetch<Locs>(url, {
		params: {
			...(filter && { match: filter }),
			pretty: false,
		},
	});
}
