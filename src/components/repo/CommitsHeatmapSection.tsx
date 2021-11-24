import { Skeleton } from "@/components/Skeleton";
import { CommitActivity } from "@/types";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Block } from "../Block";
import { Heading } from "../Heading";
import { CommitsHeatmap } from "./CommitsHeatmap";

type Props = {
	className?: string;
	enabled?: boolean;
};

export const CommitsHeatmapSection = ({ className, enabled = true }: Props) => {
	const router = useRouter();
	const { owner, repo } = router.query as {
		owner: string;
		repo: string;
	};
	const commitAcitivityLoadingToastIdRef = useRef<string>();

	const { data, isLoading, isLoadingError, failureCount } = useQuery<
		CommitActivity,
		AxiosError
	>(
		["commit_activity", { owner, repo }],
		async () => {
			const response = await axios.get<CommitActivity>(
				`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
				{
					// treat 202 as an error (indicates that Github has started
					// calculating commit activity)
					validateStatus: status =>
						status >= 200 && status < 300 && status !== 202,
				}
			);

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
			enabled: enabled && router.isReady,
			retry: true,
			retryDelay: 7500,
			staleTime: 30 * 60 * 60 * 1000, // 30 minutes
		}
	);

	useEffect(() => {
		if (isLoading && failureCount > 0) {
			if (!commitAcitivityLoadingToastIdRef.current) {
				commitAcitivityLoadingToastIdRef.current = toast.loading(
					"Waiting for Github to calculate commit activity...",
					{ duration: Infinity }
				);
			}
		} else {
			toast.dismiss(commitAcitivityLoadingToastIdRef.current);
			commitAcitivityLoadingToastIdRef.current = undefined;
		}
	}, [isLoading, failureCount]);

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
