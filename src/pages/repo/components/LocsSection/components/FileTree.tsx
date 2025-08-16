import { useMemo } from "hono/jsx";
import { DocumentIcon } from "~/components/icons/DocumentIcon";
import { FolderIcon } from "~/components/icons/FolderIcon";
import { formatNumber } from "~/lib/format";
import { Locs, LocsChild } from "~/lib/ghloc/api";
import { cn } from "~/lib/utils";
import { isFolder } from "../hooks/useLocs";
import { TreeItem } from "./TreeItem";

type FileTreeProps = {
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

	return <Icon class={cn("h-5 w-5 flex-shrink-0", isFolder && "stroke-current text-blue-400")} />;
}

function getStyleForSelectedLanguage(percentage: number) {
	return {
		backgroundSize: `${percentage}%`,
	};
}

export const FileTree = ({ locs, onSelect, selectedLanguage }: FileTreeProps) => {
	const totalLocs = useMemo(
		() =>
			Object.values(locs.children ?? {}).reduce<number>(
				(sum: number, child) => sum + getLocsValue(child),
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

		if (!node.locByLangs) {
			return 0;
		}

		return (node.locByLangs[selectedLanguage] / totalLocsOfSelectedLanguage) * 100 || 0;
	};

	const entries = Object.entries(locs.children ?? {});

	return (
		<ul class={cn("divide-border divide-y", !entries.length && "h-40")}>
			{entries.map(([name, child]) => (
				<TreeItem
					key={name}
					class={cn(
						"hover:bg-tree-active first:rounded-t-md last:rounded-b-md",
						"from-tree-active to-tree-active bg-gradient-to-r bg-no-repeat transition-[background-size] duration-[0.4s]",
					)}
					icon={renderIcon(isFolder(child))}
					text={name}
					after={renderLoc(getLocsValue(child), totalLocs)}
					name={name}
					style={getStyleForSelectedLanguage(
						getLocsPercentageOfSelectedLanguage(name, child),
					)}
					onClick={() => onSelect(name)}
				/>
			))}
		</ul>
	);
};
