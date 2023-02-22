import { SpinnerIcon } from "@/components/icons/SpinnerIcon";
import { Input } from "@/components/Input";
import { MetaTags } from "@/components/MetaTags";
import { RepoStats } from "@/components/repo/RepoStats";
import { useDebounce } from "@/hooks/useDebounce";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatTitle } from "@/lib/format";
import {
	ReposResponseItem,
	ReposSearchResponse,
	searchRepos,
} from "@/lib/github";
import { queryKeys } from "@/lib/query-keys";
import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import type { FetchError } from "ohmyfetch";
import { useState } from "react";
import toast from "react-hot-toast";

const githubUrlRegex =
	/(https?:\/\/)?github.com\/(?<owner>[^\/]+)\/(?<repo>[^\/]+)(\/[^\$]+)?/;

interface PageProps {
	query: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
	req,
	res,
	query,
}) => {
	res.setHeader("cache-control", "public, max-age=600");
	return {
		props: {
			query: (query.q as string | undefined) ?? "",
		},
	};
};

export const HomePage = ({ query: initialQuery }: PageProps) => {
	const router = useRouter();

	const isMediumOrLarger = useMediaQuery("md");

	const [query, setQuery] = useState(initialQuery);
	const [debouncedQuery, setDebouncedQuery] = useState(query);
	useDebounce(() => setDebouncedQuery(query), 750, [query]);

	const { data: results, isFetching } = useQuery({
		queryKey: queryKeys.search(debouncedQuery),
		queryFn: () => searchRepos({ query: debouncedQuery }),
		enabled: !!debouncedQuery,
		keepPreviousData: true,
		onError() {
			toast.error("Failed to load search results.");
		},
	});

	const navigateToRepoPage = (repo: ReposResponseItem) => {
		router.push({
			pathname: `/${repo.full_name}`,
			query: {
				branch: repo.default_branch,
			},
		});
	};

	const onChange = (value: string) => {
		// try to parse github url to use `owner/repo` as a query
		const match = value.match(githubUrlRegex);
		if (match?.groups) {
			const { owner, repo } = match.groups;
			value = `${owner}/${repo}`;
		}

		setQuery(value);
	};

	return (
		<>
			<MetaTags
				title={formatTitle("Count lines of code")}
				canonicalPath=""
			/>

			<Combobox
				value={null as ReposResponseItem | null}
				onChange={repo => {
					if (repo) {
						navigateToRepoPage(repo);
					}
				}}
				by={(a, b) => a?.id === b?.id}
			>
				<div className="flex-grow max-w-xl w-full mx-auto flex flex-col gap-4 group md:justify-center">
					<div className="flex-grow max-h-[4rem] hidden md:block" />

					<h1 className="text-subtle text-lg text-center">
						Count lines of code in a GitHub repository
					</h1>

					<div className="relative flex-shrink-0">
						<Combobox.Input
							as={Input}
							onChange={event => onChange(event.target.value)}
							displayValue={() => query}
							className="w-full !px-12 !py-3 text-2xl text-center !rounded-md shadow-sm border border-normal font-light group-focus-within:!border-active2"
							placeholder="facebook/react"
							autoFocus={true}
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck={false}
						/>
						<div className="absolute top-0 bottom-0 right-2 m-auto w-8 h-8 text-muted transition-[border-color] duration-100 group-focus-within:text-border-active2">
							{isFetching ? (
								<SpinnerIcon className="animate-spin" />
							) : (
								<SearchIcon />
							)}
						</div>
					</div>

					<div
						className={classNames(
							"flex-grow h-0 md:max-h-[36rem] bg-normal",
							"pointer-events-none group-focus-within:pointer-events-auto",
							results &&
								!isMediumOrLarger &&
								"!pointer-events-auto"
						)}
					>
						<Combobox.Options
							className={classNames(
								"h-max max-h-full overflow-y-auto border border-normal shadow-sm rounded-md divide-y divide-normal",
								"origin-top transition duration-75 ease-out -translate-y-2 scale-95 opacity-0",
								results?.items.length &&
									"group-focus-within:duration-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:scale-100",
								results?.items.length &&
									!isMediumOrLarger &&
									"duration-100 translate-y-0 opacity-100 scale-100"
							)}
							static
							hold
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
		</>
	);
};

export default HomePage;
