import { humanize } from "~/lib/format";
import { cn } from "~/lib/utils";
import { EyeIcon } from "./icons/EyeIcon";
import { GitForkIcon } from "./icons/GitForkIcon";
import { StarIcon } from "./icons/StarIcon";

interface RepoStatsProps {
	watchers?: number;
	stars?: number;
	forks?: number;
	class?: string;
}

export const RepoStats = ({ watchers, stars, forks, class: _class }: RepoStatsProps) => {
	const items = [
		watchers && { title: "Watchers", Icon: EyeIcon, value: watchers },
		stars && { title: "Stars", Icon: StarIcon, value: stars },
		forks && { title: "Forks", Icon: GitForkIcon, value: forks },
	].filter(v => !!v);

	return (
		<div class={cn("text-normal flex gap-2", _class)}>
			{items.map(item => (
				<div class="flex items-center gap-1" title={item.title}>
					<item.Icon class="h-4 w-4" />
					<span> {humanize(item.value)}</span>
				</div>
			))}
		</div>
	);
};
