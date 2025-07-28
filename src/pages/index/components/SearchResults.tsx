import { RepoStats } from "~/components/RepoStats";
import { GHApiSearchReposResponse } from "~/lib/github/api";
import { cn } from "~/lib/utils";

interface SearchResultsProps {
	items?: GHApiSearchReposResponse["items"];
}

export const SearchResults = ({ items }: SearchResultsProps) => {
	return (
		<div
			class={cn(
				"h-max max-h-full overflow-y-auto rounded-md",
				"border-border divide-border divide-y border",
				"origin-top -translate-y-2 transition duration-100 ease-out",
				"empty:hidden",
				items?.length &&
					cn(
						"translate-y-0 scale-100 opacity-100",
						"md:scale-95 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:scale-100 md:group-focus-within:opacity-100",
					),
			)}
		>
			{items?.map(result => (
				<a
					class={cn(
						"relative block cursor-pointer px-6 py-3 !outline-none select-none",
						"hover:bg-tree-active",
					)}
					href={`/${result.full_name}?branch=${encodeURIComponent(result.default_branch)}`}
					key={result.id}
				>
					<div>{result.full_name}</div>
					{result.description && (
						<div class="text-muted text-sm">{result.description}</div>
					)}
					<RepoStats class="mt-1" stars={result.stargazers_count} forks={result.forks} />
				</a>
			))}
		</div>
	);
};
