import { Heading } from "@/components/Heading";
import { ReposList } from "@/components/repo/ReposList";
import { Skeleton } from "@/components/Skeleton";
import { UserResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

const UserReposPage = () => {
	const router = useRouter();
	const { owner } = router.query as {
		owner: string;
	};

	const { data: user } = useQuery<UserResponse, AxiosError>(
		["user", owner],
		() =>
			axios
				.get(`https://api.github.com/users/${owner}`)
				.then(response => response.data),
		{ enabled: router.isReady }
	);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center">
				<h1 className="text-2xl">
					<a
						className="flex items-center gap-2 hover:underline"
						href={user?.html_url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Skeleton
							className="w-10 h-10 rounded-full overflow-hidden"
							isLoading={user === undefined}
						>
							{() => (
								<div className="w-10 h-10 rounded-full border-2 border-normal-border overflow-hidden">
									<img
										className="object-cover"
										src={user!.avatar_url}
										alt="avatar"
									/>
								</div>
							)}
						</Skeleton>
						<Skeleton
							className="w-32 h-6"
							isLoading={user === undefined}
						>
							{() => <span>{owner}</span>}
						</Skeleton>
					</a>
				</h1>
			</div>

			<div>
				<Heading className="mb-2">
					Repositories {user && `(${user.public_repos})`}
				</Heading>
				<ReposList user={owner} />
			</div>
		</div>
	);
};

export default UserReposPage;
