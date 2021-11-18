import classNames from "classnames";
import { Locs } from "../../types";
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

	return (
		<ul className={classNames("divide-y", className)}>
			{Object.entries(locs.locByLangs).map(([lang, loc]) => (
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
