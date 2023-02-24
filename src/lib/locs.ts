import { $fetch } from "ohmyfetch";

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
	branch: string;
	filter?: string;
}) {
	return $fetch<Locs>(`https://ghloc.ifels.dev/${owner}/${repo}/${branch}`, {
		params: {
			...(filter && { match: filter }),
			pretty: false,
		},
	});
}
