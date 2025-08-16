import { Badge } from "~/components/Badge";
import { RepoStats } from "~/components/RepoStats";
import { dayjs } from "~/lib/dayjs";
import { GHApiGetReposResponse } from "~/lib/github/api";

interface RepoCardProps {
	repo: GHApiGetReposResponse[number];
}

export const RepoCard = ({ repo }: RepoCardProps) => {
	let href = `/${repo.owner.login}/${repo.name}`;

	if (repo.default_branch) {
		href += `?branch=${encodeURIComponent(repo.default_branch)}`;
	}

	return (
		<a
			href={href}
			class="border-border hover:border-border-focus focus:border-border-focus flex min-h-[8rem] flex-col gap-1 rounded-md border px-4 py-2 transition-colors duration-100 outline-none"
		>
			<div class="flex gap-2">
				<div class="flex-grow break-all">{repo.name}</div>
				{repo.fork && <Badge class="flex-shrink-0 self-start text-xs">Fork</Badge>}
			</div>
			{repo.description && <div class="text-muted mb-1 text-sm">{repo.description}</div>}

			<div class="text-normal mt-auto text-xs">
				Updated {dayjs(repo.updated_at).fromNow()}
			</div>

			<div class="text-normal flex items-center gap-2 text-sm">
				{repo.language && (
					<div class="truncate" title={repo.language}>
						{repo.language}
					</div>
				)}
				<RepoStats
					class="ml-auto flex-shrink-0"
					stars={repo.stargazers_count}
					forks={repo.forks}
				/>
			</div>
		</a>
	);
};
