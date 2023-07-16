import classNames from "classnames";
import { Fragment } from "react";

type Props = {
	path: string[];
	onSelect: (index: number) => void;
	className?: string;
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
				"text-left",
				last
					? "font-medium cursor-text"
					: "text-link-normal hover:underline",
			)}
			onClick={onSelect}
			disabled={last}
		>
			{value}
		</button>
	);
};

export const PathBreadcrumb = ({ path, onSelect, className }: Props) => {
	return (
		<div className={classNames("", className)}>
			{path.map((name, index) => (
				<Fragment key={index}>
					<PathBreadcrumbEntry
						value={name}
						last={index + 1 === path.length}
						onSelect={() => onSelect(index)}
					/>{" "}
					{index + 1 < path.length && <span>/</span>}{" "}
				</Fragment>
			))}
		</div>
	);
};
