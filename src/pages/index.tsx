import { Input } from "@/components/Input";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { ReposSearchResponse } from "@/types";
import { Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";

export const HomePage = () => {
	const router = useRouter();
	const queryParam = typeof router.query.q === "string" ? router.query.q : "";

	const {
		state: query,
		debounced: debouncedQuery,
		setState: setQuery,
	} = useDebouncedState(queryParam, 750);
	const [showResults, setShowResults] = useState(false);

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
		router.replace({ pathname: "/", query: { q: query } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return (
		<div className="w-screen h-screen">
			<div className="max-w-xl w-full h-full mx-auto flex flex-col gap-4 p-4 justify-center">
				<div className="flex-grow max-h-[20rem]" />

				<div className="relative flex-shrink-0 group">
					<Input
						className="w-full !px-12 !py-3 text-2xl text-center rounded-lg shadow-sm border border-gray-300/80 font-light selection:bg-blue-100"
						value={query}
						placeholder="Find repo"
						autoFocus
						onChange={event => {
							setQuery(event.target.value);
							setShowResults(true);
						}}
						onFocus={() => debouncedQuery && setShowResults(true)}
						onBlur={() => setShowResults(false)}
					/>
					<div className="absolute top-0 bottom-0 right-2 m-auto w-8 h-8 text-gray-400 transition-colors duration-100 group-focus-within:text-gray-600">
						<SearchIcon />
					</div>
				</div>

				<div className="flex-grow max-h-[20rem]">
					{/* TODO: use CSS to render results */}
					<Transition
						show={showResults && !!results}
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0"
						leave="transition duration-75 ease-out"
						leaveTo="transform scale-95 opacity-0"
						as={Fragment}
					>
						<div
							className="h-full overflow-y-scroll border border-gray-200 shadow-sm rounded-lg divide-y"
							tabIndex={-1}
						>
							{results?.items.map(result => (
								<Link
									href={`/${result.full_name}`}
									key={result.id}
								>
									<a
										className={classNames(
											"block px-6 py-3 select-none relative py-1 px-3 cursor-pointer hover:bg-blue-50"
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
					</Transition>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
