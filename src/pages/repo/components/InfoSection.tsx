import { Badge } from "~/components/Badge";
import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { ExternalLinkIcon } from "~/components/icons/ExternalLinkIcon";
import { GitHubIcon } from "~/components/icons/GitHubIcon";
import { Link } from "~/components/Link";
import { RepoStats } from "~/components/RepoStats";
import { formatBytes } from "~/lib/format";
import { ghApi } from "~/lib/github/api";
import { removeProtocol } from "~/lib/utils";
import { CommonSectionProps } from "../types";
import { useSSRContext } from "~/lib/context";

type InfoSectionProps = CommonSectionProps;

export const InfoSection = async ({ owner, repo }: InfoSectionProps) => {
	const { timing } = useSSRContext();

	let data;
	try {
		data = await timing.timeAsync("repo", () => ghApi.getRepo(owner, repo));
	} catch (error) {
		console.error(error);

		return <ErrorPlaceholder>Failed to load repo info</ErrorPlaceholder>;
	}

	return (
		<>
			<div class="flex flex-wrap items-center gap-2 sm:flex-nowrap">
				<div class="text-muted xs:w-auto flex w-full flex-0 items-center gap-1 text-xl whitespace-nowrap">
					<a
						class="hover:text-link h-6 w-6 transition-colors duration-100"
						href={`https://github.com/${owner}/${repo}`}
						target="_blank"
						rel="noopener"
						title="Open repo on GitHub"
					>
						<GitHubIcon />
					</a>
					<Link href={`/${owner}`}>{owner}</Link>
					{" / "}
					<Link href={`/${owner}/${repo}`}>{repo}</Link>
				</div>

				<div class="mr-auto flex gap-2">
					{data.archived && <Badge title="Repo is archived">Archived</Badge>}
					{data.fork && <Badge title="Repo is a fork">Fork</Badge>}
					<Badge title="Repo size">{formatBytes(data.size * 1024, 0)}</Badge>
				</div>

				<RepoStats
					watchers={data.subscribers_count}
					stars={data.stargazers_count}
					forks={data.forks}
				/>
			</div>

			{data.topics && data.topics.length !== 0 && (
				<div class="flex flex-wrap gap-1">
					{data.topics.map(topic => (
						<Badge mode="accent" class="px-3">
							{topic}
						</Badge>
					))}
				</div>
			)}

			{(data.description || data.homepage) && (
				<div class="flex flex-col gap-1">
					{data.description && <p>{data.description}</p>}

					{data.homepage && (
						<Link
							class="text-link flex max-w-full items-center gap-1 self-start hover:underline"
							href={data.homepage}
							target="_blank"
							rel="noreferrer"
						>
							<ExternalLinkIcon class="inline-block h-4 w-4 shrink-0" />
							<span class="truncate">{removeProtocol(data.homepage)}</span>
						</Link>
					)}
				</div>
			)}
		</>
	);
};
