import classNames from "classnames";
import { Fragment } from "react";

type Props = {
	path: string[];
	onSelect: (index: number) => void;
};

const PathBreadcrumbEntry = ({
	value,
	last,
	onSelect,
}: {
	value: string;
	last?: boolean;
	onSelect: () => void;
}) => {
	return (
		<button
			className={classNames(
				last
					? "font-extrabold cursor-text"
					: "text-accent-fg hover:underline"
			)}
			onClick={onSelect}
			disabled={last}
		>
			{value}
		</button>
	);
};

export const PathBreadcrumb = ({ path, onSelect }: Props) => {
	return (
		<div className="flex gap-1 items-center whitespace-nowrap overflow-x-auto">
			{path.map((name, index) => (
				<Fragment key={index}>
					<PathBreadcrumbEntry
						value={name}
						last={index + 1 === path.length}
						onSelect={() => onSelect(index)}
					/>
					{index + 1 < path.length && <span>/</span>}
				</Fragment>
			))}
		</div>
	);
};
