import { ReposResponseItem } from "@/types";
import { formatRepoStat } from "@/utils";
import { StarIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { Badge } from "../Badge";
import { GitForkIcon } from "../icons/GitForkIcon";
import { Spacer } from "../Spacer";

type Props = {
	repo: ReposResponseItem;
};

export const RepoCard = ({ repo }: Props) => {
	return (
		<Link
			href={{
				pathname: `/${repo.owner.login}/${repo.name}`,
				query: { branch: repo.default_branch },
			}}
			key={repo.id}
		>
			<a className="min-h-[8rem] flex flex-col gap-1 border rounded-md px-4 py-2 transition-colors duration-100 outline-none hover:border-black focus:border-black">
				<div className="flex gap-2">
					<div className="flex-grow break-all">{repo.name}</div>
					{repo.fork && (
						<Badge className="self-start flex-shrink-0 text-xs">
							Fork
						</Badge>
					)}
				</div>
				{repo.description && (
					<div className="text-sm text-gray-600 mb-1">
						{repo.description}
					</div>
				)}

				<Spacer />

				<div className="text-xs text-gray-800">
					Updated {dayjs(repo.updated_at).fromNow()}
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-800">
					{repo.language && (
						<div className="mr-2 truncate" title={repo.language}>
							{repo.language}
						</div>
					)}
					<div className="flex gap-2">
						<div className="whitespace-nowrap" title="Stars">
							<StarIcon className="inline-block w-4 h-4 align-text-bottom" />{" "}
							{formatRepoStat(repo.stargazers_count)}
						</div>
						<div className="whitespace-nowrap" title="Forks">
							<GitForkIcon className="inline-block w-4 h-4 align-text-bottom" />{" "}
							{formatRepoStat(repo.forks_count)}
						</div>
					</div>
				</div>
			</a>
		</Link>
	);
};