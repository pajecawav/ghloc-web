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
import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Heading } from "../Heading";
import { FilePreview } from "./FilePreview";
import { FilterHelpTooltip } from "./FilterHelpTooltip";

type Props = {
	defaultBranch?: string;
};

const sortOrders: Record<SortOrder, SelectOption> = {
	type: { name: "Type" },
	locs: { name: "Locs" },
} as const;

export const RepoLocsSection = ({ defaultBranch }: Props) => {
	const router = useRouter();
	const { owner, repo, branch } = router.query as {
		owner: string;
		repo: string;
		branch?: string;
	};
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
	const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
		null
	);

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
			// NOTE: the actual service is hosted on https://ghloc.bytes.pw but
			// uBlock Origin has a rule to block all third-party requests to
			// *.pw so we use ghloc.elif.pw (which is the same domain) as a
			// proxy to ghloc.bytes.pw
			let url = `https://ghloc.elif.pw/${owner}/${repo}`;
			if (branch) {
				url += `/${branch}`;
			}
			return axios
				.get<Locs>(url, {
					params: {
						...(filter && { match: debouncedFilter }),
					},
				})
				.then(response => response.data);
		},
		{ enabled: router.isReady, keepPreviousData: true }
	);

	useEffect(() => {
		if (locsQuery.isLoadingError && !axios.isCancel(locsQuery.error)) {
			toast.error("Failed to load LOC stats: repo is too big.");
		}
	}, [locsQuery.isLoadingError, locsQuery.error]);

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

	const isFile = pathLocs && !pathLocs.children;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 flex-wrap">
				<PathBreadcrumb
					className="flex-grow break-all w-full xs:w-auto"
					path={[repo, ...path]}
					onSelect={index =>
						setPath(index === 0 ? [] : path.slice(0, index))
					}
				/>

				{/* <Spacer className="hidden sm:block" /> */}

				<div className="flex gap-2 flex-nowrap  ml-auto w-full xs:w-auto">
					<Select
						className="hidden xs:block w-40"
						value={order}
						options={sortOrders}
						onChange={value => setOrder(value as SortOrder)}
						label="Sort by "
						title="Sort order"
					/>
					<div className="relative w-full sm:flex-shrink-0 sm:flex-grow-0 xs:w-48">
						<Input
							className="w-full pr-10"
							placeholder="Filter"
							value={filter}
							onChange={e => setFilter(e.target.value)}
						/>
						<div className="absolute top-0 bottom-0 right-0 pr-2 grid place-items-center">
							<FilterHelpTooltip tooltipClassName="-mr-2" />
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div
					className={classNames(
						"flex flex-col gap-1 self-start order-last sm:order-first",
						isFile && "col-span-1 sm:col-span-2"
					)}
				>
					<div className="flex">
						<Heading>Files</Heading>
						<Spacer />
						<Select
							className="block xs:hidden flex-shrink-0 w-40"
							value={order}
							options={sortOrders}
							onChange={value => setOrder(value as SortOrder)}
							label="Sort by "
							title="Sort order"
						/>
					</div>
					<Block>
						{isFile ? (
							<FilePreview
								owner={owner}
								repo={repo}
								branch={(branch || defaultBranch)!}
								path={path}
								// TODO: fix LOCs types
								loc={pathLocs as any as number}
							/>
						) : (
							<Skeleton
								className="h-80"
								isLoading={pathLocs === undefined}
							>
								<LocsTree
									locs={pathLocs!}
									order={order}
									onSelect={name => setPath([...path, name])}
									selectedLanguage={selectedLanguage}
								/>
							</Skeleton>
						)}
					</Block>
				</div>

				{!isFile && (
					<div className="flex flex-col gap-1 self-start">
						<Heading>
							Lines of code {pathLocs?.loc && `(${pathLocs.loc})`}
						</Heading>
						<Block>
							<Skeleton
								className="h-80"
								isLoading={pathLocs === undefined}
							>
								{() => (
									<LocsStats
										locs={pathLocs!}
										selectedLanguage={selectedLanguage}
										onSelectLanguage={setSelectedLanguage}
									/>
								)}
							</Skeleton>
						</Block>
					</div>
				)}
			</div>
		</div>
	);
};
