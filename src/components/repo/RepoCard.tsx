import { ReposResponseItem } from "@/lib/github";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { Badge } from "../Badge";
import { Spacer } from "../Spacer";
import { RepoStats } from "./RepoStats";

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
		>
			<a className="min-h-[8rem] flex flex-col gap-1 border border-normal rounded-md px-4 py-2 transition-colors duration-100 !outline-none hover:border-active focus:border-active">
				<div className="flex gap-2">
					<div className="flex-grow break-all">{repo.name}</div>
					{repo.fork && (
						<Badge className="self-start flex-shrink-0 text-xs">
							Fork
						</Badge>
					)}
				</div>
				{repo.description && (
					<div className="text-sm text-muted mb-1">
						{repo.description}
					</div>
				)}

				<Spacer />

				<div className="text-xs text-normal">
					Updated {dayjs(repo.updated_at).fromNow()}
				</div>

				<div className="flex items-center gap-2 text-sm text-normal">
					{repo.language && (
						<div className="truncate" title={repo.language}>
							{repo.language}
						</div>
					)}
					<RepoStats
						className="ml-auto flex-shrink-0"
						stars={repo.stargazers_count}
						forks={repo.forks}
					/>
				</div>
			</a>
		</Link>
	);
};
