import { definePage } from "@pajecawav/yamf";
import { useEvent } from "@pajecawav/yamf";
import { withServerTiming } from "nitro/h3";
import { Heading } from "~/components/Heading";
import { ghApi } from "~/lib/github/api";
import { buildPageTitle } from "~/lib/title";
import { RepoCard } from "./components/RepoCard";

export default definePage({
	cache: {
		maxAge: 60,
		swr: 7 * 24 * 60 * 60,
	},
	render: (event, { head }) => {
		const { owner } = event.context.params ?? {};

		const title = buildPageTitle(`${owner} GitHub repositories`);

		head.push({
			title,
			meta: [
				{
					name: "description",
					content: `Lines of code statistics for ${owner}'s GitHub repositories: LOC by language, repo size and commit activity.`,
				},
				{ property: "og:title", content: title },
			],
		});

		return <OwnerPage owner={owner} />;
	},
});

interface OwnerPageProps {
	owner: string;
}

export const OwnerPage = async ({ owner }: OwnerPageProps) => {
	const event = useEvent();

	const repos = await withServerTiming(event, "repos", () => ghApi.getRepos(owner));

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center">
				<h1 className="text-2xl">
					<a
						className="flex items-center gap-2 hover:underline"
						href={`https://github.com/${owner}`}
						target="_blank"
						rel="noopener"
					>
						<div className="h-10 w-10 overflow-hidden rounded-full border-2 border-border">
							<img
								className="object-cover"
								src={`https://github.com/${owner}.png?size=64`}
								alt="User avatar"
							/>
						</div>
						<span>{owner}</span>
					</a>
				</h1>
			</div>

			<div>
				<Heading class="mb-2">Repositories</Heading>

				<div
					className="grid gap-4"
					style={{
						gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
					}}
				>
					{repos.map(repo => (
						<RepoCard repo={repo} key={repo.id} />
					))}
				</div>
			</div>
		</div>
	);
};
