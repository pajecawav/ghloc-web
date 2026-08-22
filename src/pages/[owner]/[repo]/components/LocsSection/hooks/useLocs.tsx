import { useEffect, useMemo } from "hono/jsx";
import { FetchError } from "ofetch";
import useSWRImmutable from "swr/immutable";
import { ghlocApi, Locs, LocsChild } from "~/lib/ghloc/api";
import { toast } from "~/lib/toasts/toasts";

export type SortOrder = "type" | "locs";

const EMPTY_LOCS: Locs = { loc: 0, locByLangs: {} };

export interface UseLocsOptions {
	sortOrder?: SortOrder;
	filter?: string;
	owner: string;
	repo: string;
	branch?: string;
}

export function isFolder(child: LocsChild): child is Locs {
	return typeof child !== "number";
}

export function useLocs(
	path: string[],
	{ sortOrder, filter, owner, repo, branch }: UseLocsOptions,
) {
	const { data, error, isValidating } = useSWRImmutable(
		["locs", owner, repo, branch, filter],
		() => ghlocApi.getLocs({ owner, repo, branch, filter }),
		{ keepPreviousData: true },
	);

	useEffect(() => {
		if (!error) {
			return;
		}

		let content: string;
		if (error instanceof FetchError) {
			content = `Failed to load LOC stats: ${error.data?.error}`;
		} else {
			content = "Failed to load LOC stats.";
		}

		toast.show({ type: "error", content });
	}, [error]);

	const locs = data;

	const pathLocs = useMemo<Locs | number | null>(() => {
		if (!locs) {
			return locs ?? null;
		}

		let pathLocs: Locs = locs;

		for (const dir of path) {
			if (!pathLocs.children || !(dir in pathLocs.children)) {
				return EMPTY_LOCS;
			}

			const child = pathLocs.children[dir];

			if (!isFolder(child)) {
				return child;
			}

			pathLocs = child;
		}

		return pathLocs;
	}, [locs, path]);

	const sortedLocs = useMemo((): Locs | number | null => {
		if (!pathLocs || !isFolder(pathLocs)) {
			return pathLocs;
		}

		const children = pathLocs.children;
		if (!children) {
			return pathLocs;
		}

		if (sortOrder === "locs") {
			return pathLocs;
		}

		const names = Object.keys(children);

		names.sort((nameA, nameB) => {
			const a = children[nameA] as Locs;
			const b = children[nameB] as Locs;

			const isFolderA = isFolder(a);
			const isFolderB = isFolder(b);

			if (isFolderA !== isFolderB) {
				return Number(isFolderB) - Number(isFolderA);
			}

			return nameA < nameB ? -1 : 1;
		});

		const sortedChildren: Record<string, LocsChild> = {};
		for (const name of names) {
			sortedChildren[name] = children[name];
		}

		return { ...pathLocs, children: sortedChildren };
	}, [pathLocs, sortOrder]);

	return { locs: sortedLocs, isValidating };
}
