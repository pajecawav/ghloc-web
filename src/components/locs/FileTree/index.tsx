import { isFolder } from "@/hooks/useLocs";
import { formatNumber } from "@/lib/format";
import { Locs, LocsChild } from "@/lib/locs";
import { DocumentIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useMemo } from "react";

type Props = {
	locs: Locs;
	onSelect: (name: string) => void;
	selectedLanguage?: string | null;
};

function getLocsValue(child: LocsChild): number {
	return typeof child === "number" ? child : child.loc;
}

function renderLoc(loc: number, total: number): string {
	return `${formatNumber(loc)} (${((100 * loc) / total).toFixed(1)}%)`;
}

function renderIcon(isFolder: boolean) {
	const Icon = isFolder ? FolderIcon : DocumentIcon;
	return (
		<Icon
			className={classNames(
				"w-5 h-5 flex-shrink-0",
				isFolder && "text-blue-400 stroke-black dark:stroke-current",
			)}
		/>
	);
}

function getStyleForSelectedLanguage(percentage: number) {
	return {
		backgroundSize: `${percentage}%`,
	};
}

export const FileTree = ({ locs, onSelect, selectedLanguage }: Props) => {
	const totalLocs = useMemo(
		() =>
			Object.values(locs.children ?? {}).reduce<number>(
				(sum, child) => sum + getLocsValue(child),
				0,
			),
		[locs],
	);

	const totalLocsOfSelectedLanguage = selectedLanguage
		? locs.locByLangs?.[selectedLanguage] || 0
		: 0;

	const getLocsPercentageOfSelectedLanguage = (name: string, node: LocsChild) => {
		if (!selectedLanguage || !totalLocsOfSelectedLanguage) return 0;

		if (!isFolder(node)) {
			return name.endsWith(selectedLanguage) ? (node / totalLocsOfSelectedLanguage) * 100 : 0;
		}

		if (!node.locByLangs) return 0;

		return (node.locByLangs[selectedLanguage] / totalLocsOfSelectedLanguage) * 100 || 0;
	};

	const entries = Object.entries(locs.children ?? {});

	return (
		<ul className={classNames("divide-y divide-normal", !entries.length && "h-40")}>
			{entries.map(([name, child]) => (
				<li
					className={classNames(
						"hover:bg-tree-active first:rounded-t-md last:rounded-b-md",
						"bg-gradient-to-r from-tree-active to-tree-active bg-no-repeat transition-[background-size] duration-[0.4s]",
					)}
					style={getStyleForSelectedLanguage(
						getLocsPercentageOfSelectedLanguage(name, child),
					)}
					key={name}
				>
					<button
						className="w-full px-2 py-1 flex items-center gap-2 disabled:cursor-text select-text"
						onClick={() => onSelect(name)}
						title={name}
					>
						<span>{renderIcon(isFolder(child))}</span>
						<span className="truncate">{name}</span>
						<span className="ml-auto whitespace-nowrap">
							{renderLoc(getLocsValue(child), totalLocs)}
						</span>
					</button>
				</li>
			))}
		</ul>
	);
};
