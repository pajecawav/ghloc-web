import { Heading } from "@/components/Heading";
import { MetaTags } from "@/components/MetaTags";
import { ReposList } from "@/components/repo/ReposList";
import { formatTitle } from "@/lib/format";
import { getUser, getUserRepos, UserResponse } from "@/lib/github";
import { queryKeys } from "@/lib/query-keys";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import type { FetchError } from "ohmyfetch";
import { ServerTiming } from "tiny-server-timing";

interface PageProps {
	owner: string;
}

export const getServerSideProps: GetServerSideProps<
	PageProps,
	{ owner: string }
> = async ({ req, res, params, query }) => {
	const token = req.cookies.token;
	const owner = params!.owner;

	if (!token) {
		return {
			props: { owner },
		};
	}

	const client = new QueryClient();
	const timing = new ServerTiming();

	await Promise.all([
		timing.timeAsync("repos", () =>
			client.prefetchInfiniteQuery(
				["user", owner, "repos"],
				({ pageParam: page }) =>
					getUserRepos({
						user: owner,
						perPage: 18,
						page,
					})
			)
		),
		timing.timeAsync("user", () =>
			client.prefetchQuery(["user", owner], () => getUser(owner))
		),
	]);

	res.setHeader("Server-Timing", timing.getHeaders()["Server-Timing"]);

	return {
		props: {
			owner,
			// HACK: for infinite query `pageParams` contains `undefined` for
			// the first page so Next fails to serialize it
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(client))),
		},
	};
};

const UserReposPage = ({ owner }: PageProps) => {
	const { data: user } = useQuery<UserResponse, FetchError>({
		queryKey: queryKeys.user(owner),
		queryFn: () => getUser(owner),
	});

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
