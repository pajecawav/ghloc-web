import { LocsChild } from "@/types";
import { DocumentIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { Spacer } from "../../Spacer";
import { getValueOfChild } from "./LocsTree.utils";

type Props = {
	className?: string;
	name: string;
	node: LocsChild;
	percentage: number;
	langLocsPercentage?: number;
	onSelect?: (name: string) => void;
};

export const LocsTreeEntry = ({
	className,
	name,
	node,
	percentage,
	langLocsPercentage,
	onSelect,
}: Props) => {
	const isFile = typeof node === "number";

	return (
		<li
			className={classNames("hover:bg-tree-active", className)}
			style={{
				backgroundSize: `${langLocsPercentage || 0}%`,
			}}
		>
			<button
				className="w-full px-2 py-1 flex items-center gap-2 disabled:cursor-text select-text"
				onClick={() => onSelect?.(name)}
				title={name}
			>
				<div className="w-5 h-5 flex-shrink-0">
					{isFile ? (
						<DocumentIcon />
					) : (
						<FolderIcon
							className="text-blue-400 stroke-black dark:stroke-current"
							strokeWidth="1"
						/>
					)}
				</div>
				<span className="text-left truncate">{name}</span>
				<Spacer />

				<span className="whitespace-nowrap">
					{getValueOfChild(node)} ({(100 * percentage).toFixed(2)}
					%)
				</span>
			</button>
		</li>
	);
};
