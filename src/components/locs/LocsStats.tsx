import { getLanguageFromExtension } from "@/languages";
import { Locs } from "@/types";
import classNames from "classnames";
import React, { useCallback } from "react";
import { Spacer } from "../Spacer";

export type Props = {
	locs: Locs;
	className?: string;
	selectedLanguage?: string | null;
	onSelectLanguage?: (language: string | null) => void;
};

export const LocsStats = ({
	locs,
	className,
	selectedLanguage,
	onSelectLanguage,
}: Props) => {
	const totalLocs = Object.values(locs.locByLangs).reduce(
		(sum, loc) => sum + loc,
		0
	);

	const handleSelectLanguage = useCallback(
		(language: string) => {
			onSelectLanguage?.(language === selectedLanguage ? null : language);
		},
		[selectedLanguage, onSelectLanguage]
	);

	const entries = Object.entries(locs.locByLangs);

	return (
		<ul
			className={classNames(
				"divide-y divide-normal",
				className,
				!entries.length && "h-40"
			)}
		>
			{entries.map(([lang, loc]) => (
				<li key={lang}>
					<button
						className={classNames(
							"w-full flex px-2 py-1 gap-2 hover:bg-tree-active",
							lang === selectedLanguage && "bg-tree-active"
						)}
						onClick={() => handleSelectLanguage(lang)}
					>
						<span
							className="text-left truncate"
							title={getLanguageFromExtension(lang) ?? undefined}
						>
							{lang}
						</span>
						<Spacer />
						<span className="whitespace-nowrap">
							{loc} ({((100 * loc) / totalLocs).toFixed(2)}%)
						</span>
					</button>
				</li>
			))}
		</ul>
	);
};
