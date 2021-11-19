import { Heading } from "@/components/locs/Heading";
import { ReposList } from "@/components/repo/ReposList";
import { Skeleton } from "@/components/Skeleton";
import { UserResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import React from "react";
import { useQuery } from "react-query";

type Props = {
	owner: string;
};

const UserReposPage = ({ owner }: Props) => {
	const { data: user } = useQuery<UserResponse, AxiosError>(
		["user", owner],
		() =>
			axios
				.get(`https://api.github.com/users/${owner}`)
				.then(response => response.data)
	);

	return (
		<div className="max-w-3xl p-4 mx-auto flex flex-col gap-5">
			<div className="flex items-center">
				{!user ? (
					<div className="flex items-center gap-2">
						<Skeleton className="w-10 h-10 rounded-full overflow-auto" />
						<Skeleton className="w-32 h-6" />
					</div>
				) : (
					<h1 className="text-2xl">
						<a
							className="flex items-center gap-2 hover:underline"
							href={user.html_url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="w-10 h-10 rounded-full border-2 overflow-hidden">
								<img
									className="object-cover"
									src={user.avatar_url}
									alt="avatar"
								/>
							</div>
							<span>{owner}</span>
						</a>
					</h1>
				)}
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

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
	const { owner } = ctx.query as {
		owner: string;
	};

	return {
		props: { owner },
	};
};

export default UserReposPage;
