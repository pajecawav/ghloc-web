import { Skeleton } from "@/components/Skeleton";
import {
	CommitActivity,
	getCommitActivity,
	GitHubActivityCalculationStartedError,
} from "@/lib/github";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import type { FetchError } from "ohmyfetch";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { Block } from "../Block";
import { Heading } from "../Heading";
import { CommitsHeatmap } from "./CommitsHeatmap";

type Props = {
	className?: string;
	owner: string;
	repo: string;
	enabled?: boolean;
};

export const CommitsHeatmapSection = ({
	className,
	owner,
	repo,
	enabled = true,
}: Props) => {
	const { data, error, isLoading, isLoadingError, failureCount } = useQuery<
		CommitActivity,
		FetchError | GitHubActivityCalculationStartedError
	>({
		queryKey: queryKeys.commitActivity({ owner, repo }),
		queryFn: async () => {
			const data = await getCommitActivity({ owner, repo });

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
		enabled,
		retry(_, error) {
			return (
				error instanceof GitHubActivityCalculationStartedError ||
				error.response?.status !== 403
			);
		},
		retryDelay: 7500,
		onError(error) {
			toast.error("Failed to load commit activity.");
		},
	});

	const totalCommits = useMemo(() => {
		if (!data) return data;
		return data.reduce((sum, entry) => sum + entry.total, 0);
	}, [data]);

	return (
		<div className={classNames("flex flex-col gap-1", className)}>
			<Heading>
				Commits{" "}
				{totalCommits !== undefined && ` (${totalCommits} last year)`}
			</Heading>
			<Skeleton className="h-36 rounded-md" isLoading={!data}>
				{() => (
					<Block className="h-36 p-4 grid place-items-center">
						<CommitsHeatmap data={data!} />
					</Block>
				)}
			</Skeleton>
		</div>
	);
};
