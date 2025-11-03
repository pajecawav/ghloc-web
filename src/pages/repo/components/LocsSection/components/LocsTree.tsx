import { formatNumber } from "~/lib/format";
import { Locs } from "~/lib/ghloc/api";
import { getLanguageFromExtension } from "~/lib/languages";
import { cn } from "~/lib/utils";
import { TreeItem } from "./TreeItem";

export type LocsTreeProps = {
	locs: Locs;
	selectedLanguage?: string | null;
	onSelectLanguage?: (language: string | null) => void;
};

function renderLoc(loc: number, total: number): string {
	return `${formatNumber(loc)} (${((100 * loc) / total).toFixed(1)}%)`;
}

export const LocsTree = ({ locs, selectedLanguage, onSelectLanguage }: LocsTreeProps) => {
	const totalLocs = Object.values(locs.locByLangs ?? {}).reduce((sum, loc) => sum + loc, 0);

	const handleSelectLanguage = (language: string) => {
		onSelectLanguage?.(language === selectedLanguage ? null : language);
	};

	const entries = Object.entries(locs.locByLangs ?? {});

	return (
		<ul class={cn("divide-border divide-y", !entries.length && "h-40")}>
			{entries.map(([lang, loc]) => (
				<TreeItem
					// key={lang}
					class={cn(lang === selectedLanguage && "bg-tree-active")}
					text={lang}
					after={renderLoc(loc, totalLocs)}
					name={getLanguageFromExtension(lang) ?? undefined}
					onClick={() => handleSelectLanguage(lang)}
				/>
			))}
		</ul>
	);
};
