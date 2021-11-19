import { ReposResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { Skeleton } from "../Skeleton";
import { RepoCard } from "./RepoCard";

type Props = {
	user: string;
};

export const ReposList = ({ user }: Props) => {
	// TODO: use infinite query
	const { data: reposData } = useQuery<ReposResponse, AxiosError>(
		["user", user, "repos"],
		() =>
			axios
				.get(`https://api.github.com/users/${user}/repos`)
				.then(response => response.data)
	);

	const repos = useMemo(() => {
		if (!reposData) {
			return undefined;
		}

		const data = [...reposData];

		data.sort((a, b) => {
			if (a.updated_at < b.updated_at) return 1;
			if (a.updated_at > b.updated_at) return -1;
			return 0;
		});

		return data;
	}, [reposData]);

	return (
		<div
			className="grid gap-4"
			style={{
				gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
			}}
		>
			{!repos
				? Array.from({ length: 6 }).map((_, index) => (
						// TODO: proper RepoCard skeleton
						<Skeleton
							className="h-32 border rounded-md"
							key={index}
						/>
				  ))
				: repos.map(repo => <RepoCard repo={repo} key={repo.id} />)}
		</div>
	);
};
