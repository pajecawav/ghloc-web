import classNames from "classnames";
import { GitForkIcon } from "@/components/icons/GitForkIcon";
import { EyeIcon, StarIcon } from "@heroicons/react/solid";
import React from "react";
import { formatRepoStat } from "@/utils";

type Props = {
	watchers?: number;
	stars?: number;
	forks?: number;
	className?: string;
};

export const RepoStats = ({ watchers, stars, forks, className }: Props) => {
	return (
		<div className={classNames("flex gap-2 text-gray-700", className)}>
			{watchers && (
				<div title="Watchers">
					<EyeIcon className="inline-block w-4 h-4 align-text-bottom" />{" "}
					{formatRepoStat(watchers)}
				</div>
			)}
			{stars && (
				<div title="Stars">
					<StarIcon className="inline-block w-4 h-4 align-text-bottom" />{" "}
					{formatRepoStat(stars)}
				</div>
			)}
			{forks && (
				<div title="Forks">
					<GitForkIcon className="inline-block w-4 h-4 align-text-bottom" />{" "}
					{formatRepoStat(forks)}
				</div>
			)}
		</div>
	);
};
