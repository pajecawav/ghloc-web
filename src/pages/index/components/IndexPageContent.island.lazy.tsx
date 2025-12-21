import { useEffect, useLayoutEffect, useRef, useState } from "hono/jsx";
import { SearchIcon } from "~/components/icons/SearchIcon";
import { SpinnerIcon } from "~/components/icons/SpinnerIcon";
import { Input } from "~/components/Input";
import { useDebouncedValue } from "~/lib/debounce";
import { ghApi } from "~/lib/github/api";
import { useQuery } from "~/lib/query/useQuery";
import { useRouter } from "~/lib/router/useRouter";
import { cn } from "~/lib/utils";
import { SearchResults } from "./SearchResults";

const githubUrlRegex = /(https?:\/\/)?github.com\/(?<owner>[^/]+)\/(?<repo>[^/?]+)(\/[^$]+)?/;

export default function IndexPageContent() {
	const router = useRouter();

	const inputRef = useRef<HTMLInputElement>(null);
	const queryValue = router.search.get("query") ?? "";
	const debouncedQuery = useDebouncedValue(queryValue, 750);

	const [activeIndex, setActiveIndex] = useState(0);

	const query = useQuery({
		queryKey: ["searchRepos", debouncedQuery],
		queryFn: () => ghApi.searchRepos(debouncedQuery),
		enabled: !!debouncedQuery,
	});

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useLayoutEffect(() => {
		setActiveIndex(0);
	}, [query?.data]);

	const onChange = (e: Event) => {
		if (e.target instanceof HTMLInputElement) {
			let newQuery = e.target.value;

			if ("inputType" in e && (e as InputEvent).inputType === "insertFromPaste") {
				const match = newQuery.match(githubUrlRegex);
				if (match?.groups) {
					const { owner, repo } = match.groups;
					newQuery = `${owner}/${repo}`;
				}
			}

			router.setSearch(prev => {
				prev.set("query", newQuery);

				return prev;
			});
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			const item = query.data?.items[activeIndex];

			if (item) {
				location.href = `/${item.full_name}?branch=${encodeURIComponent(item.default_branch)}`;
			}
		} else if (e.key === "ArrowDown") {
			setActiveIndex(Math.min(activeIndex + 1, (query.data?.items.length ?? 1) - 1));
			e.preventDefault();
		} else if (e.key === "ArrowUp") {
			setActiveIndex(Math.max(activeIndex - 1, 0));
			e.preventDefault();
		}
	};

	return (
		<div class="group mx-auto flex w-full max-w-xl flex-grow flex-col gap-4 md:justify-center">
			<div class="max-h-0.5 flex-grow md:max-h-16" />

			<h1 class="text-center text-lg">Count lines of code in a GitHub repository</h1>

			<div class="flex-shrink-0">
				<Input
					onKeyDown={onKeyDown}
					ref={inputRef}
					value={queryValue}
					onChange={onChange}
					inputClass="py-3 text-center text-2xl font-light"
					type="text"
					placeholder="facebook/react"
					autofocus
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck={false}
					after={
						<div
							class={cn(
								"h-8 w-8 transition-colors duration-100",
								"text-neutral-400 group-focus-within:text-black dark:text-neutral-500 dark:group-focus-within:text-neutral-400",
							)}
						>
							{query.status === "fetching" ? (
								<SpinnerIcon class="animate-spin" />
							) : (
								<SearchIcon />
							)}
						</div>
					}
				/>
			</div>

			<div class="h-0 flex-grow md:max-h-[36rem]">
				<SearchResults
					activeIndex={activeIndex}
					onChangeActiveIndex={setActiveIndex}
					items={query.data?.items}
				/>
			</div>
		</div>
	);
}
