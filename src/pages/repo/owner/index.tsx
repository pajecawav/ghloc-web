import { Heading } from "~/components/Heading";
import { useSSRContext } from "~/lib/context";
import { ghApi } from "~/lib/github/api";
import { RepoCard } from "./components/RepoCard";

interface OwnerPageProps {
	owner: string;
}

export const OwnerPage = async ({ owner }: OwnerPageProps) => {
	const { timing } = useSSRContext();

	const repos = await timing.timeAsync("repos", () => ghApi.getRepos(owner));

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
						<div className="border-border h-10 w-10 overflow-hidden rounded-full border-2">
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
