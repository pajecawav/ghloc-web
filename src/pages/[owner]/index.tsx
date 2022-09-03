import { Heading } from "@/components/Heading";
import { ReposList } from "@/components/repo/ReposList";
import { Skeleton } from "@/components/Skeleton";
import { getUser, UserResponse } from "@/lib/github";
import { formatTitle } from "@/lib/format";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { FetchError } from "ohmyfetch";

const UserReposPage = () => {
	const router = useRouter();
	const { owner } = router.query as {
		owner: string;
	};

	const { data: user } = useQuery<UserResponse, FetchError>(
		["user", owner],
		() => getUser(owner),
		{ enabled: router.isReady }
	);

	return (
		<div className="flex flex-col gap-5">
			{router.isReady && (
				<Head>
					<title>{formatTitle(`${owner}`)}</title>
				</Head>
			)}

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
								<div className="w-10 h-10 rounded-full border-2 border-normal overflow-hidden">
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
