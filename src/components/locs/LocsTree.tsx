import { Locs, LocsChild } from "@/types";
import { DocumentIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import React, { useMemo } from "react";
import { Spacer } from "../Spacer";

export type SortOrder = "type" | "locs";

type Props = {
	locs: Locs;
	className?: string;
	order?: SortOrder;
	onSelect?: (name: string) => void;
};

function getValueOfChild(child: LocsChild): number {
	return typeof child === "number" ? child : child.loc;
}

const LocsTreeEntry = ({
	name,
	node,
	percentage,
	onSelect,
}: {
	name: string;
	node: LocsChild;
	percentage: number;
	onSelect: Props["onSelect"];
}) => {
	const isFile = typeof node === "number";

	return (
		<li className="px-2 py-1 hover:bg-gray-100">
			<a
				className="flex items-center gap-2"
				href={isFile ? undefined : "#"}
				onClick={() => {
					if (typeof node !== "number") {
						onSelect?.(name);
					}
				}}
			>
				<div className="w-5 h-5 flex-shrink-0">
					{isFile ? (
						<DocumentIcon />
					) : (
						<FolderIcon className="text-blue-400" />
					)}
				</div>
				<span
					className={classNames(
						"text-left truncate",
						!isFile && "hover:underline hover:text-blue-700"
					)}
				>
					{name}
				</span>
				<Spacer />

				<span className="whitespace-nowrap">
					{getValueOfChild(node)} ({(100 * percentage).toFixed(2)}
					%)
				</span>
			</a>
		</li>
	);
};

export const LocsTree = ({ locs, className, order, onSelect }: Props) => {
	const children = useMemo(() => {
		if (!locs.children) {
			throw new Error("children are empty");
		}

		if (order === "locs") {
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

	const totalLocs = Object.values(children).reduce<number>(
		(sum, child) => sum + getValueOfChild(child),
		0
	);

	const entries = Object.entries(children);

	return (
		<ul
			className={classNames(
				"divide-y",
				className,
				!entries.length && "h-40"
			)}
		>
			{entries.map(([name, child]) => (
				<LocsTreeEntry
					name={name}
					node={child}
					percentage={getValueOfChild(child) / totalLocs}
					onSelect={onSelect}
					key={name}
				/>
			))}
		</ul>
	);
};
