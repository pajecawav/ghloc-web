import { Locs, LocsChild } from "@/types";
import { useMemo } from "react";
import { SortOrder } from ".";

export function useSortedLocs(locs: Locs, order?: SortOrder) {
	const children = useMemo(() => {
		if (!locs.children) {
			throw new Error("children are empty");
		}

		if (!order || order === "locs") {
			return locs.children;
		}

		const names = Object.keys(locs.children);

		names.sort((nameA, nameB) => {
			const a = locs.children![nameA] as Locs;
			const b = locs.children![nameB] as Locs;

			const isDirA = a.children !== undefined;
			const isDirB = b.children !== undefined;

			if (isDirA !== isDirB) {
				return Number(isDirB) - Number(isDirA);
			}

			return nameA < nameB ? -1 : 1;
		});

		let sortedChildren: Record<string, LocsChild> = {};
		for (const name of names) {
			sortedChildren[name] = locs.children[name];
		}

		return sortedChildren;
	}, [locs, order]);

	return children;
}
