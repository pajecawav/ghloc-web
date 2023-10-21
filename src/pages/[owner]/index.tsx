import { Heading } from "@/components/Heading";
import { MetaTags } from "@/components/MetaTags";
import { ReposList } from "@/components/repo/ReposList";
import { formatTitle } from "@/lib/format";
import { getUserRepos } from "@/lib/github";
import { queryKeys } from "@/lib/query-keys";
import { shouldEnableSsr } from "@/lib/ssr";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { ServerTiming } from "tiny-server-timing";

interface PageProps {
	owner: string;
}

export const getServerSideProps: GetServerSideProps<
	PageProps,
	{ owner: string }
> = async ({ req, res, params, query }) => {
	res.setHeader("cache-control", "public, max-age=300");

	const owner = params!.owner;

	if (!shouldEnableSsr()) {
		return {
			props: { owner },
		};
	}

	const client = new QueryClient();
	const timing = new ServerTiming();

	try {
		await Promise.allSettled([
			timing.timeAsync("repos", () =>
				client.prefetchInfiniteQuery({
					queryKey: ["user", owner, "repos"],
					queryFn: ({ pageParam: page }) =>
						getUserRepos({
							user: owner,
							perPage: 18,
							page,
						}),
					initialPageParam: 1,
				}),
			),
		]);
	} catch (e: unknown) {
		console.error("Failed to prefetch all queries:", e);
	}

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
	return (
		<div className="flex flex-col gap-5">
			<MetaTags
				title={formatTitle(`${owner}`)}
				path={`/${owner}`.toLowerCase()}
			/>

			<div className="flex items-center">
				<h1 className="text-2xl">
					<a
						className="flex items-center gap-2 hover:underline"
						href={`https://github.com/${owner}`}
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
				<Heading className="mb-2">Repositories</Heading>
				<ReposList user={owner} />
			</div>
		</div>
	);
};

export default UserReposPage;
