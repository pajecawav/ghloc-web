import { Input } from "@/components/Input";
import { RepoStats } from "@/components/repo/RepoStats";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	ReposResponseItem,
	ReposSearchResponse,
	searchRepos,
} from "@/lib/github";
import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import { AxiosError } from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

export const HomePage = () => {
	const router = useRouter();

	const isMediumOrLarger = useMediaQuery("md");

	const {
		state: query,
		debounced: debouncedQuery,
		setState: setQuery,
	} = useDebouncedState("", 750);
	const resultsRef = useRef<HTMLUListElement | null>(null);

	const { data: results, isLoadingError } = useQuery<
		ReposSearchResponse,
		AxiosError
	>(
		["search", debouncedQuery],
		() =>
			searchRepos({ query: debouncedQuery }).then(
				response => response.data
			),
		{
			enabled: !!debouncedQuery,
			staleTime: Infinity,
			keepPreviousData: true,
		}
	);

	useEffect(() => {
		if (resultsRef.current) {
			resultsRef.current.scrollTop = 0;
		}
	}, [results]);

	useEffect(() => {
		if (isLoadingError) {
			toast.error("Failed to load search results.");
		}
	}, [isLoadingError]);

	const navigateToRepoPage = (repo: ReposResponseItem) => {
		router.push({
			pathname: `/${repo.full_name}`,
			query: {
				branch: repo.default_branch,
			},
		});
	};

	return (
		<Combobox
			value={null as ReposResponseItem | null}
			onChange={repo => {
				if (repo) {
					navigateToRepoPage(repo);
				}
			}}
		>
			<div className="flex-grow max-w-xl w-full mx-auto flex flex-col gap-4 group md:justify-center">
				<div className="flex-grow max-h-[4rem] hidden md:block" />

				<h1 className="text-subtle text-lg text-center">
					See stats of a GitHub repository
				</h1>

				<div className="relative flex-shrink-0">
					<Combobox.Input
						as={Input}
						onChange={event => setQuery(event.target.value)}
						displayValue={() => query}
						className="w-full !px-12 !py-3 text-2xl text-center !rounded-lg shadow-sm border border-normal font-light group-focus-within:!border-active2 caret-blue-400"
						placeholder="facebook/react"
						type="search"
						autoFocus
					/>
					<div className="absolute top-0 bottom-0 right-2 m-auto w-8 h-8 text-muted transition-colors duration-100 group-focus-within:text-border-active2">
						<SearchIcon className="heroicon-sw-1" />
					</div>
				</div>

				<div
					className={classNames(
						"flex-grow h-0 md:max-h-[36rem] bg-normal",
						"pointer-events-none group-focus-within:pointer-events-auto",
						results && !isMediumOrLarger && "!pointer-events-auto"
					)}
				>
					<Combobox.Options
						className={classNames(
							"h-max max-h-full overflow-y-auto border border-normal shadow-sm rounded-lg divide-y divide-normal",
							"origin-top transition duration-75 ease-out -translate-y-2 scale-95 opacity-0",
							results?.items.length &&
								"group-focus-within:duration-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:scale-100",
							results?.items.length &&
								!isMediumOrLarger &&
								"duration-100 translate-y-0 opacity-100 scale-100"
						)}
						static
						hold
						ref={resultsRef}
					>
						{results?.items.map(result => (
							<Combobox.Option
								className={({ active }) =>
									classNames(
										"block px-6 py-3 select-none relative cursor-pointer !outline-none",
										active && "bg-select-active"
									)
								}
								value={result}
								key={result.id}
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
							</Combobox.Option>
						))}
					</Combobox.Options>
				</div>
			</div>
		</Combobox>
	);
};

export default HomePage;
