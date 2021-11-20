import { Input } from "@/components/Input";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { ReposSearchResponse } from "@/types";
import { SearchIcon } from "@heroicons/react/outline";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const HomePage = () => {
	const router = useRouter();
	const queryParam = typeof router.query.q === "string" ? router.query.q : "";

	const {
		state: query,
		debounced: debouncedQuery,
		setState: setQuery,
	} = useDebouncedState(queryParam, 750);

	const { data: results } = useQuery<ReposSearchResponse, AxiosError>(
		["search", debouncedQuery],
		() =>
			axios
				.get("https://api.github.com/search/repositories", {
					params: { q: debouncedQuery, per_page: 10 },
				})
				.then(response => response.data),
		{
			enabled: !!debouncedQuery && router.isReady,
			staleTime: Infinity,
			keepPreviousData: true,
		}
	);

	useEffect(() => {
		router.replace({
			pathname: "/",
			query: { ...(query && { q: query }) },
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return (
		<div className="w-screen h-screen">
			<div className="max-w-xl w-full h-full mx-auto flex flex-col gap-4 p-4 group lg:justify-center">
				<div className="flex-grow max-h-[20rem] hidden lg:block" />

				<div className="relative flex-shrink-0">
					<Input
						className="w-full !px-12 !py-3 text-2xl text-center rounded-lg shadow-sm border border-gray-300/80 font-light group-focus-withing:border-black"
						value={query}
						placeholder="Find repo"
						autoFocus
						onChange={event => {
							setQuery(event.target.value);
						}}
					/>
					<div className="absolute top-0 bottom-0 right-2 m-auto w-8 h-8 text-gray-400 transition-colors duration-100 group-focus-within:text-gray-600">
						<SearchIcon />
					</div>
				</div>

				<div className="flex-grow h-0 lg:max-h-[20rem]">
					<div
						className={classNames(
							"h-max max-h-full overflow-y-auto border border-gray-200 shadow-sm rounded-lg divide-y",
							"transition duration-100 ease-out scale-95 opacity-0",
							query &&
								results &&
								"group-focus-within:duration-75 group-focus-within:opacity-100 group-focus-within:scale-100"
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
										"block px-6 py-3 select-none relative cursor-pointer outline-none hover:bg-blue-50 focus:bg-blue-50"
									)}
								>
									<div>{result.full_name}</div>
									{result.description && (
										<div className="text-sm text-gray-500">
											{result.description}
										</div>
									)}
								</a>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
