import { Skeleton } from "@/components/Skeleton";
import { CommitActivity } from "@/types";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Block } from "../Block";
import { Heading } from "../Heading";
import { CommitsHeatmap } from "./CommitsHeatmap";

type Props = {
	className?: string;
};

export const CommitsHeatmapSection = ({ className }: Props) => {
	const router = useRouter();
	const { owner, repo } = router.query as {
		owner: string;
		repo: string;
	};

	const { data, isLoadingError } = useQuery<
		CommitActivity,
		AxiosError | Error
	>(
		["commit_activity", { owner, repo }],
		async () => {
			const response = await axios.get<CommitActivity>(
				`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`
			);

			if (response.status === 202) {
				throw new Error("Waiting for API to calculate commit activity");
			}

			const data = response.data;

			// remove future dates data
			const now = new Date().getTime();
			let lastWeek = data.pop()!;
			lastWeek.days = lastWeek.days.filter((_, index) => {
				const day =
					lastWeek.week * 1000 + index * (1000 * 60 * 60 * 24);
				return day <= now;
			});
			if (lastWeek.days.length) {
				data.push(lastWeek);
			}

			return data;
		},
		{
			enabled: router.isReady,
			retry: true,
			retryDelay: 7500,
			staleTime: 30 * 60 * 60 * 1000, // 30 minutes
		}
	);

	useEffect(() => {
		if (isLoadingError) {
			toast.error("Failed to load commit activity.");
		}
	}, [isLoadingError]);

	return (
		<div className={classNames("flex flex-col gap-1", className)}>
			<Heading>Commits</Heading>
			<Skeleton className="h-32 rounded-md" isLoading={!data}>
				{() => (
					<Block className="p-4">
						<CommitsHeatmap data={data!} />
					</Block>
				)}
			</Skeleton>
		</div>
	);
};
