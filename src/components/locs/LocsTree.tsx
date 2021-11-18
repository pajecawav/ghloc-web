import classNames from "classnames";
import { Locs, LocsChild } from "../../types";
import { Spacer } from "../Spacer";
import { DocumentIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";

type Props = {
	locs: Locs;
	className?: string;
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
		<li className="flex items-center px-2 py-1 gap-2">
			<div className="w-5 h-5">
				{isFile ? (
					<DocumentIcon />
				) : (
					<FolderIcon className="text-blue-400" />
				)}
			</div>
			<button
				className={classNames(
					"text-left truncate",
					isFile
						? "cursor-default"
						: "hover:underline hover:text-blue-700"
				)}
				onClick={() => {
					if (typeof node !== "number") {
						onSelect?.(name);
					}
				}}
				// TODO: repalce with 'a' tag which has automatic title
				title={name}
			>
				{name}
			</button>
			<Spacer />

			<span className="whitespace-nowrap">
				{getValueOfChild(node)} ({(100 * percentage).toFixed(2)}
				%)
			</span>
		</li>
	);
};

export const LocsTree = ({ locs, className, onSelect }: Props) => {
	if (!locs.children) {
		return null;
	}

	const totalLocs = Object.values(locs.children).reduce<number>(
		(sum, child) => sum + getValueOfChild(child),
		0
	);

	return (
		<ul className={classNames("divide-y", className)}>
			{Object.entries(locs.children).map(([name, child]) => (
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
