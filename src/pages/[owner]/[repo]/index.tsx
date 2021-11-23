import { Badge } from "@/components/Badge";
import { RepoLocsSection } from "@/components/locs/RepoLocsSection";
import { CommitsHeatmapSection } from "@/components/repo/CommitsHeatmapSection";
import { RepoHealthSection } from "@/components/repo/RepoHealthSection";
import { RepoStats } from "@/components/repo/RepoStats";
import { Skeleton } from "@/components/Skeleton";
import { Spacer } from "@/components/Spacer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { RepoResponse } from "@/types";
import { formatRepoSize, removeProtocol } from "@/utils";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

export const RepoPage = () => {
	const router = useRouter();
	const { owner, repo: repoName } = router.query as {
		owner: string;
		repo: string;
	};
	const isSmallOrLarger = useMediaQuery("sm");

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
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
				<Skeleton
					className="h-6 w-40 rounded-full"
					isLoading={!router.isReady}
				>
					<div className="flex gap-1 items-center whitespace-nowrap overflow-x-auto text-xl text-muted-text w-full xs:w-auto">
						<Link href={`/${owner}`}>
							<a className="text-normal-link hover:underline">
								{owner}
							</a>
						</Link>{" "}
						/{" "}
						<Link href={`/${owner}/${repoName}`}>
							<a className="text-normal-link hover:underline">
								{repoName}
							</a>
						</Link>
					</div>
				</Skeleton>

				{repo && (
					<div className="flex flex-grow gap-2 flex-wrap">
						{repo.archived && (
							<Badge
								className="flex-shrink-0 text-xs"
								color="outlined"
								title="Repo is archived"
							>
								Archived
							</Badge>
						)}
						{repo.fork && (
							<Badge
								className="flex-shrink-0 text-xs"
								color="outlined"
								title="Repo is a fork"
							>
								Fork
							</Badge>
						)}
						<Badge
							className="flex-shrink-0 text-xs"
							color="outlined"
							title="Repo size"
						>
							{formatRepoSize(repo.size)}
						</Badge>

						<Spacer className="hidden xs:block" />

						<RepoStats
							watchers={repo.subscribers_count}
							stars={repo.stargazers_count}
							forks={repo.forks}
						/>
					</div>
				)}
			</div>

			{!repo ? (
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton
							className="border border-normal-border rounded-full h-4 w-14"
							key={index}
						/>
					))}
				</div>
			) : (
				repo.topics.length !== 0 && (
					<div className="flex flex-wrap gap-2">
						{repo.topics.map(topic => (
							<Badge className="px-3 text-xs" key={topic}>
								{topic}
							</Badge>
						))}
					</div>
				)
			)}

			<div className="flex flex-col gap-1">
				<Skeleton
					className="h-5 mb-1 rounded-full sm:w-3/4"
					isLoading={repo === undefined}
				>
					{repo?.description && <p>{repo.description}</p>}
				</Skeleton>

				<Skeleton
					className="h-5 mb-1 rounded-full sm:w-3/4"
					isLoading={repo === undefined}
				>
					{repo?.homepage && (
						<a
							className="w-max text-normal-link hover:underline"
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

			<RepoHealthSection />

			<CommitsHeatmapSection
				className="hidden sm:flex"
				enabled={isSmallOrLarger}
			/>

			<RepoLocsSection defaultBranch={repo?.default_branch} />
		</div>
	);
};

export default RepoPage;
