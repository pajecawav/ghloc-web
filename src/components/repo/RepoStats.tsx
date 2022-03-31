import { GitForkIcon } from "@/components/icons/GitForkIcon";
import { formatRepoStat } from "@/lib/format";
import { EyeIcon, StarIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import React from "react";

type Props = {
	watchers?: number;
	stars?: number;
	forks?: number;
	className?: string;
};

export const RepoStats = ({ watchers, stars, forks, className }: Props) => {
	return (
		<div className={classNames("flex gap-2 text-normal", className)}>
			{watchers !== undefined && (
				<div className="flex gap-1 items-center" title="Watchers">
					<EyeIcon className="w-4 h-4" />
					<span> {formatRepoStat(watchers)}</span>
				</div>
			)}
			{stars !== undefined && (
				<div className="flex gap-1 items-center" title="Stars">
					<StarIcon className="w-4 h-4" />
					<span>{formatRepoStat(stars)}</span>
				</div>
			)}
			{forks !== undefined && (
				<div className="flex gap-1 items-center" title="Forks">
					<GitForkIcon className="w-4 h-4" />
					<span> {formatRepoStat(forks)}</span>
				</div>
			)}
		</div>
	);
};
