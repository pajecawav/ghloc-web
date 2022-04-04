import { Locs, LocsChild } from "@/types";
import classNames from "classnames";
import React, { useMemo } from "react";
import { LocsTreeEntry } from "./LocsTreeEntry";
import { getValueOfChild } from "./LocsTree.utils";
import { blue } from "tailwindcss/colors";
import { useSortedLocs } from "./useSortedLocs";
import styles from "./LocsTree.module.css";

export type SortOrder = "type" | "locs";

type Props = {
	locs: Locs;
	className?: string;
	order?: SortOrder;
	onSelect?: (name: string) => void;
	selectedLanguage?: string | null;
};

export const LocsTree = ({
	locs,
	className,
	order,
	onSelect,
	selectedLanguage,
}: Props) => {
	const sortedLocs = useSortedLocs(locs, order);

	const totalLocs = useMemo(
		() =>
			Object.values(sortedLocs).reduce<number>(
				(sum, child) => sum + getValueOfChild(child),
				0
			),
		[sortedLocs]
	);

	const getLocsOfSelectedLanguage = (name: string, node: LocsChild) => {
		if (!selectedLanguage) {
			return 0;
		}

		if (typeof node === "number") {
			return name.endsWith(selectedLanguage) ? node : 0;
		}

		return node.locByLangs[selectedLanguage] ?? 0;
	};
	const totalLocsForSelectedLanguage = Object.entries(
		sortedLocs
	).reduce<number>(
		(sum, [name, node]) => sum + getLocsOfSelectedLanguage(name, node),
		0
	);

	const entries = Object.entries(sortedLocs);

	return (
		<ul
			className={classNames(
				"divide-y divide-normal",
				className,
				!entries.length && "h-40"
			)}
		>
			{entries.map(([name, node]) => {
				const langLocs = getLocsOfSelectedLanguage(name, node);
				const langLocsPercentage = langLocs
					? (langLocs / totalLocsForSelectedLanguage) * 100
					: null;

				return (
					<LocsTreeEntry
						className={styles.entry}
						name={name}
						node={node}
						percentage={
							totalLocs ? getValueOfChild(node) / totalLocs : 0
						}
						langLocsPercentage={langLocsPercentage || 0}
						onSelect={onSelect}
						key={name}
					/>
				);
			})}
		</ul>
	);
};
