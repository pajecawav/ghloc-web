import { Locs } from "@/types";
import classNames from "classnames";
import React from "react";
import { Spacer } from "../Spacer";

export type Props = {
	locs: Locs;
	className?: string;
};

export const LocsStats = ({ locs, className }: Props) => {
	const totalLocs = Object.values(locs.locByLangs).reduce(
		(sum, loc) => sum + loc,
		0
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
				<li className="flex px-2 py-1 gap-2" key={lang}>
					<span className="text-left truncate">{lang}</span>
					<Spacer />
					<span className="whitespace-nowrap">
						{loc} ({((100 * loc) / totalLocs).toFixed(2)}%)
					</span>
				</li>
			))}
		</ul>
	);
};
