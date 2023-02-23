import { Heading } from "@/components/Heading";
import { MetaTags } from "@/components/MetaTags";
import { ReposList } from "@/components/repo/ReposList";
import { formatTitle } from "@/lib/format";
import { getUser, UserResponse } from "@/lib/github";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import type { FetchError } from "ohmyfetch";

interface PageProps {
	owner: string;
}

export const getServerSideProps: GetServerSideProps<
	PageProps,
	{ owner: string }
> = async ({ req, res, params, query }) => {
	res.setHeader("cache-control", "public, max-age=600");
	return {
		props: {
			owner: params!.owner,
		},
	};
};

const UserReposPage = ({ owner }: PageProps) => {
	const { data: user } = useQuery<UserResponse, FetchError>(
		["user", owner],
		() => getUser(owner)
	);

	return (
		<div className="flex flex-col gap-5">
			<MetaTags
				title={formatTitle(`${owner}`)}
				canonicalPath={`/${owner}`}
			/>

			<div className="flex items-center">
				<h1 className="text-2xl">
					<a
						className="flex items-center gap-2 hover:underline"
						href={user?.html_url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="w-10 h-10 rounded-full border-2 border-normal overflow-hidden">
							<img
								className="object-cover"
								src={`https://github.com/${owner}.png?size=64`}
								alt="avatar"
							/>
						</div>
						<span>{owner}</span>
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
