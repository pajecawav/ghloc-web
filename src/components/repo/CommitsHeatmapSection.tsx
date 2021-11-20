import { Skeleton } from "@/components/Skeleton";
import { CommitActivity } from "@/types";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
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

	const { data } = useQuery<CommitActivity, AxiosError>(
		["commit_activity", { owner, repo }],
		() =>
			axios
				.get<CommitActivity>(
					`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`
				)
				.then(response => response.data),
		{ enabled: router.isReady, staleTime: 30 * 60 * 60 /* 30 minutes */ }
	);

	if (!data) {
		return <Skeleton className="h-24" />;
	}

	return (
		<div className={classNames("flex flex-col gap-1", className)}>
			<Heading>Commits</Heading>
			<CommitsHeatmap data={data} />
		</div>
	);
};
