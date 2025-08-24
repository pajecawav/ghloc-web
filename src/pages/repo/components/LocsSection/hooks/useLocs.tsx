import { useEffect, useMemo } from "hono/jsx";
import { FetchError } from "ofetch";
import { ghlocApi, Locs, LocsChild } from "~/lib/ghloc/api";
import { useQuery } from "~/lib/query/useQuery";
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
	const query = useQuery({
		queryKey: ["locs", owner, repo, branch, filter],
		queryFn: () => ghlocApi.getLocs({ owner, repo, branch, filter }),
	});

	useEffect(() => {
		if (!query.error) {
			return;
		}

		let content: string;
		if (query.error instanceof FetchError) {
			content = `Failed to load LOC stats: ${query.error.data?.error}`;
		} else {
			content = "Failed to load LOC stats.";
		}

		toast.show({ type: "error", content });
	}, [query.error]);

	const locs = "data" in query ? query.data : null;

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
