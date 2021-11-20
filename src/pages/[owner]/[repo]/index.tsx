import { Badge } from "@/components/Badge";
import { GitForkIcon } from "@/components/icons/GitForkIcon";
import { RepoLocsSection } from "@/components/locs/RepoLocsSection";
import { CommitsHeatmapSection } from "@/components/repo/CommitsHeatmapSection";
import { Skeleton } from "@/components/Skeleton";
import { Spacer } from "@/components/Spacer";
import { RepoResponse } from "@/types";
import { formatRepoSize, formatRepoStat, removeProtocol } from "@/utils";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { EyeIcon, StarIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

export const RepoStatsPage = () => {
	const router = useRouter();
	const { owner, repo: repoName } = router.query as {
		owner: string;
		repo: string;
	};

	const repoQuery = useQuery<RepoResponse, AxiosError>(
		["repos", repoName],
		() =>
			axios
				.get(`https://api.github.com/repos/${owner}/${repoName}`)
				.then(response => response.data),
		{ enabled: router.isReady }
	);
	const repo = repoQuery.data;

	return (
		<div className="max-w-3xl p-4 mx-auto flex flex-col gap-2">
			<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
				<Skeleton
					className="h-6 w-40 rounded-full"
					isLoading={!router.isReady}
				>
					<div className="flex gap-1 items-center whitespace-nowrap overflow-x-auto text-xl w-full xs:w-auto">
						<Link href={`/${owner}`}>
							<a className="text-accent-fg hover:underline">
								{owner}
							</a>
						</Link>{" "}
						/{" "}
						<Link href={`/${owner}/${repoName}`}>
							<a className="text-accent-fg hover:underline">
								{repoName}
							</a>
						</Link>
					</div>
				</Skeleton>

				{repo && (
					<div className="flex flex-grow gap-2">
						{repo.archived && (
							<Badge
								className="flex-shrink-0 text-xs"
								title="Repo is archived"
							>
								Archived
							</Badge>
						)}
						{repo.fork && (
							<Badge
								className="flex-shrink-0 text-xs"
								title="Repo is a fork"
							>
								Fork
							</Badge>
						)}
						<Badge
							className="flex-shrink-0 text-xs"
							title="Repo size"
						>
							{formatRepoSize(repo.size)}
						</Badge>
						<Spacer className="hidden xs:block" />
						<div
							className="flex items-center gap-1 text-gray-700"
							title="Watchers"
						>
							<EyeIcon className="w-4 h-4" />
							<div>{formatRepoStat(repo.subscribers_count)}</div>
						</div>
						<div
							className="flex items-center gap-1 text-gray-700"
							title="Stars"
						>
							<StarIcon className="w-4 h-4" />
							<div>{formatRepoStat(repo.stargazers_count)}</div>
						</div>
						<div
							className="flex items-center gap-1 text-gray-700"
							title="Forks"
						>
							<GitForkIcon className="w-4 h-4" />
							<div>{formatRepoStat(repo.forks_count)}</div>
						</div>
					</div>
				)}
			</div>

			{!repo ? (
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton
							className="border rounded-full h-4 w-14"
							key={index}
						/>
					))}
				</div>
			) : (
				repo.topics.length !== 0 && (
					<div className="flex flex-wrap gap-2">
						{repo.topics.map(topic => (
							<Badge
								className="px-3 bg-blue-100 text-gray-700 text-xs"
								key={topic}
							>
								{topic}
							</Badge>
						))}
					</div>
				)
			)}

			<div className="flex flex-col gap-1">
				<Skeleton
					className="h-6 rounded-full sm:w-3/4"
					isLoading={repo === undefined}
				>
					{repo?.description && <div>{repo.description}</div>}
				</Skeleton>

				<Skeleton
					className="h-6 rounded-full sm:w-3/4"
					isLoading={repo === undefined}
				>
					{repo?.homepage && (
						<a
							className="w-max text-accent-fg hover:underline"
							href={repo.homepage}
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLinkIcon className="inline-block w-4 h-4" />{" "}
							{removeProtocol(repo.homepage)}
						</a>
					)}
				</Skeleton>
			</div>

			<CommitsHeatmapSection />

			<RepoLocsSection />
		</div>
	);
};

export default RepoStatsPage;
