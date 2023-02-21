import { getLocs, Locs, LocsChild } from "@/lib/locs";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { $fetch, FetchError } from "ohmyfetch";
import { useMemo } from "react";
import toast from "react-hot-toast";

export type SortOrder = "type" | "locs";

const EMPTY_LOCS: Locs = { loc: 0, locByLangs: {} };

export interface UseLocsOptions {
	sortOrder?: SortOrder;
	filter?: string;
	owner: string;
	repo: string;
	branch?: string | null;
}

export function isFolder(child: LocsChild): child is Locs {
	return typeof child !== "number";
}

export function useLocs(
	path: string[],
	{ sortOrder = "type", filter, owner, repo, branch }: UseLocsOptions
) {
	const query = useQuery<Locs, FetchError>({
		queryKey: queryKeys.locs({
			owner,
			repo,
			branch: branch!,
			filter: filter ?? null,
		}),
		queryFn: () => getLocs({ owner, repo, branch: branch!, filter }),
		enabled: !!branch,
		keepPreviousData: true,
		onError() {
			toast.error("Failed to load LOC stats: probably repo is too big.");
		},
	});

	const locs = query.data ?? null;

	const pathLocs = useMemo<Locs | number | null>(() => {
		if (!locs) return locs;

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
		if (!pathLocs || !isFolder(pathLocs)) return pathLocs;

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

	return sortedLocs;
}
