import { Input } from "@/components/Input";
import { RepoStats } from "@/components/repo/RepoStats";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { ReposSearchResponse } from "@/types";
import { SearchIcon } from "@heroicons/react/outline";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

export const HomePage = () => {
	const router = useRouter();
	const queryParam =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search).get("q") || ""
			: "";

	const {
		state: query,
		debounced: debouncedQuery,
		setState: setQuery,
	} = useDebouncedState(queryParam, 750);

	const { data: results, isLoadingError } = useQuery<
		ReposSearchResponse,
		AxiosError
	>(
		["search", debouncedQuery],
		() =>
			axios
				.get("https://api.github.com/search/repositories", {
					params: { q: debouncedQuery, per_page: 10 },
				})
				.then(response => response.data),
		{
			// enabled: !!debouncedQuery && router.isReady,
			enabled: !!debouncedQuery,
			staleTime: Infinity,
			keepPreviousData: true,
		}
	);

	useEffect(() => {
		if (router.isReady) {
			router.replace({
				pathname: "/",
				query: { ...(query && { q: query }) },
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	useEffect(() => {
		if (isLoadingError) {
			toast.error("Failed to load search results.");
		}
	}, [isLoadingError]);

	const showResults = query && results;

	return (
		<div className="flex-grow max-w-xl w-full mx-auto flex flex-col gap-4 group md:justify-center">
			<div className="flex-grow max-h-[4rem] hidden md:block" />

			<h1 className="text-subtle text-lg text-center">
				See stats of a Github repository
			</h1>

			<div className="relative flex-shrink-0">
				<Input
					className="w-full !px-12 !py-3 text-2xl text-center !rounded-lg shadow-sm border border-normal font-light group-focus-within:!border-active2 caret-blue-400"
					value={query}
					placeholder="Find repo"
					autoFocus
					// onChange event doesn't detect when the input is cleared
					onInput={event => setQuery(event.currentTarget.value)}
				/>
				<div className="absolute top-0 bottom-0 right-2 m-auto w-8 h-8 text-muted transition-colors duration-100 group-focus-within:text-border-active2">
					<SearchIcon className="heroicon-sw-1" />
				</div>
			</div>

			<div
				className={classNames(
					"flex-grow h-0 md:max-h-[36rem] bg-normal pointer-events-none group-focus-within:pointer-events-auto"
				)}
			>
				<div
					className={classNames(
						"h-max max-h-full overflow-y-auto border border-normal shadow-sm rounded-lg divide-y divide-normal",
						"transition duration-75 ease-out scale-95 opacity-0",
						showResults &&
							results.items.length &&
							"group-focus-within:duration-100 group-focus-within:opacity-100 group-focus-within:scale-100"
					)}
					tabIndex={-1}
				>
					{results?.items.map(result => (
						<Link
							href={{
								pathname: `/${result.full_name}`,
								query: {
									branch: result.default_branch,
								},
							}}
							key={result.id}
						>
							<a
								className={classNames(
									"block px-6 py-3 select-none relative cursor-pointer !outline-none hover:bg-select-active focus:bg-select-active"
								)}
							>
								<div>{result.full_name}</div>
								{result.description && (
									<div className="text-sm text-muted">
										{result.description}
									</div>
								)}
								<RepoStats
									className="mt-1"
									stars={result.stargazers_count}
									forks={result.forks}
								/>
							</a>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
