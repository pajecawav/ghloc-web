import { useCallback } from "hono/jsx";
import { RepoStats } from "~/components/RepoStats";
import { GHApiSearchReposResponse } from "~/lib/github/api";
import { cn } from "~/lib/utils";

interface SearchResultsProps {
	activeIndex: number;
	onChangeActiveIndex: (activeIndex: number) => void;
	items?: GHApiSearchReposResponse["items"];
}

export const SearchResults = ({ activeIndex, onChangeActiveIndex, items }: SearchResultsProps) => {
	const scrollIntoView = useCallback((node: HTMLElement) => {
		node?.scrollIntoView({ block: "nearest" });
	}, []);
	const activeItem = items?.[activeIndex];

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
			{items?.map((item, index) => {
				const isActive = item === activeItem;

				return (
					<a
						class={cn(
							"relative block cursor-pointer px-6 py-3 !outline-none select-none",
							// "hover:bg-tree-active focus-visible:bg-tree-active",
							isActive && "bg-tree-active",
						)}
						href={`/${item.full_name}?branch=${encodeURIComponent(item.default_branch)}`}
						key={item.id}
						onPointerEnter={() => onChangeActiveIndex(index)}
						onFocusIn={() => onChangeActiveIndex(index)}
						ref={isActive ? scrollIntoView : undefined}
					>
						<div>{item.full_name}</div>
						{item.description && (
							<div class="text-muted text-sm">{item.description}</div>
						)}
						<RepoStats class="mt-1" stars={item.stargazers_count} forks={item.forks} />
					</a>
				);
			})}
		</div>
	);
};
