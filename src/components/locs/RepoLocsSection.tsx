import { Block } from "@/components/Block";
import { Input } from "@/components/Input";
import { LocsStats } from "@/components/locs/LocsStats";
import { LocsTree, SortOrder } from "@/components/locs/LocsTree";
import { PathBreadcrumb } from "@/components/locs/PathBreadcrumb";
import { Select, SelectOption } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { Spacer } from "@/components/Spacer";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { Locs } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Heading } from "../Heading";
import { FilterHelpTooltip } from "./FilterHelpTooltip";

const sortOrders: Record<SortOrder, SelectOption> = {
	type: { name: "Type" },
	locs: { name: "Locs" },
} as const;

export const RepoLocsSection = () => {
	const router = useRouter();
	const { owner, repo, branch } = router.query as {
		owner: string;
		repo: string;
		branch?: string;
	};
	// TODO: move this to useEffect and add 'setImmediateState' to 'useDebouncedState`?
	const filterParam =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search).get("filter") || ""
			: "";

	const {
		state: filter,
		debounced: debouncedFilter,
		setState: setFilter,
	} = useDebouncedState(filterParam, 1000);
	const [order, setOrder] = useState<keyof typeof sortOrders>("type");

	let path: string[];
	try {
		path = JSON.parse(router.query.locs_path as string);
	} catch (e) {
		path = [];
	}
	const setPath = (newPath: string[]) => {
		const query = router.query;
		delete query.locs_path;

		router.push(
			{
				pathname: router.pathname,
				query: {
					...query,
					...(newPath.length && {
						locs_path: JSON.stringify(newPath),
					}),
				},
			},
			undefined,
			{ scroll: false, shallow: true }
		);
	};

	const locsQuery = useQuery<Locs, AxiosError>(
		["stats", { owner, repo, branch, filter: debouncedFilter }],
		() => {
			let url = `https://ghloc.bytes.pw/${owner}/${repo}`;
			if (branch) {
				url += `/${branch}`;
			}
			return axios
				.get<Locs>(url, {
					params: {
						...(filter && { filter: debouncedFilter }),
					},
				})
				.then(response => response.data);
		},
		{ enabled: router.isReady, keepPreviousData: true }
	);

	useEffect(() => {
		if (locsQuery.isLoadingError) {
			toast.error("Failed to load LOC stats.");
		}
	}, [locsQuery.isLoadingError]);

	useEffect(() => {
		if (router.isReady) {
			const query = router.query;
			delete query.filter;

			router.replace({
				pathname: router.pathname,
				query: {
					...query,
					...(debouncedFilter && { filter: debouncedFilter }),
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedFilter]);

	let pathLocs: Locs | undefined;
	if (locsQuery.data) {
		pathLocs = locsQuery.data;
		for (const name of path) {
			if (pathLocs.children && name in pathLocs.children) {
				pathLocs = pathLocs.children[name] as Locs;
			} else {
				pathLocs = { loc: 0, locByLangs: {}, children: {} };
				break;
			}
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
				<PathBreadcrumb
					className="xs:w-full"
					path={[repo, ...path]}
					onSelect={index =>
						setPath(index === 0 ? [] : path.slice(0, index))
					}
				/>

				<Spacer className="hidden sm:block" />

				<Select
					className="sm:flex-shrink-0 w-full xs:flex-grow sm:flex-grow-0 xs:w-auto sm:w-40"
					value={order}
					options={sortOrders}
					onChange={value => setOrder(value as SortOrder)}
					label="Sort by "
					title="Sort order"
				/>
				<div className="flex items-center gap-2 sm:flex-shrink-0 w-full xs:flex-grow-[4] sm:flex-grow-0 xs:w-auto">
					<Input
						className="flex-grow sm:w-40"
						placeholder="Filter"
						value={filter}
						onChange={e => setFilter(e.target.value)}
						rightIcon={
							<FilterHelpTooltip className="flex-shrink-0 pr-2" />
						}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-1 self-start order-last sm:order-first">
					<Heading>Files</Heading>
					<Block>
						<Skeleton
							className="h-80"
							isLoading={pathLocs === undefined}
						>
							{() => (
								<LocsTree
									locs={pathLocs!}
									order={order}
									onSelect={name => setPath([...path, name])}
								/>
							)}
						</Skeleton>
					</Block>
				</div>
				<div className="flex flex-col gap-1 self-start">
					<Heading>
						Lines of code {pathLocs?.loc && `(${pathLocs.loc})`}
					</Heading>
					<Block>
						<Skeleton
							className="h-80"
							isLoading={pathLocs === undefined}
						>
							{() => <LocsStats locs={pathLocs!} />}
						</Skeleton>
					</Block>
				</div>
			</div>
		</div>
	);
};
