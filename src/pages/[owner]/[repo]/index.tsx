import { Block } from "@/components/Block";
import { Input } from "@/components/Input";
import { Heading } from "@/components/locs/Heading";
import { LocsStats } from "@/components/locs/LocsStats";
import { LocsTree, SortOrder } from "@/components/locs/LocsTree";
import { PathBreadcrumb } from "@/components/locs/PathBreadcrumb";
import { Select, SelectOption } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { Spacer } from "@/components/Spacer";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { Locs } from "@/types";
import axios, { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import DefaultErrorPage from "next/error";
import React, { useState } from "react";
import { useQuery } from "react-query";

type Props = {
	owner: string;
	repo: string;
	branch: string | null;
};

const sortOrders: Record<SortOrder, SelectOption> = {
	type: { name: "Type" },
	locs: { name: "Locs" },
} as const;

export const RepoStatsPage = ({ owner, repo, branch }: Props) => {
	const router = useRouter();

	const {
		state: filter,
		debounced: debouncedFilter,
		setState: setFilter,
	} = useDebouncedState("", 1000);
	const [order, setOrder] = useState<keyof typeof sortOrders>("type");

	let path: string[];
	try {
		path = JSON.parse(router.query.locs_path as string);
	} catch (e) {
		path = [];
	}
	const setPath = (newPath: string[]) => {
		router.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					locs_path: JSON.stringify(newPath),
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
		{ keepPreviousData: true }
	);

	if (locsQuery.isError) {
		return <DefaultErrorPage statusCode={404} />;
	}

	let pathLocs;
	if (!(locsQuery.isLoading || locsQuery.isIdle)) {
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
		<div className="max-w-3xl p-4 mx-auto flex flex-col gap-2">
			<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
				<PathBreadcrumb
					className="py-1 xs:w-full"
					path={[repo, ...path]}
					onSelect={index =>
						setPath(index === 0 ? [] : path.slice(0, index))
					}
				/>
				<Spacer className="hidden sm:block" />
				<Select
					className="self-stretch sm:flex-shrink-0 w-full xs:flex-grow sm:flex-grow-0 xs:w-auto sm:w-28"
					value={order}
					options={sortOrders}
					onChange={value => setOrder(value as SortOrder)}
				/>
				<Input
					className="self-stretch sm:flex-shrink-0 w-full xs:flex-grow-[4] sm:flex-grow-0 xs:w-auto sm:w-40"
					placeholder="Filter"
					value={filter}
					onChange={e => setFilter(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-1 self-start order-last sm:order-first">
					<Heading>Files</Heading>
					<Block>
						{pathLocs ? (
							<LocsTree
								locs={pathLocs}
								order={order}
								onSelect={name => setPath([...path, name])}
							/>
						) : (
							<Skeleton className="h-80" />
						)}
					</Block>
				</div>
				<div className="flex flex-col gap-1 self-start">
					<Heading>Lines of code</Heading>
					<Block>
						{pathLocs ? (
							<LocsStats locs={pathLocs} />
						) : (
							<Skeleton className="h-80" />
						)}
					</Block>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
	const { owner, repo, branch } = ctx.query as {
		owner: string;
		repo: string;
		branch?: string;
	};

	return {
		props: { owner, repo, branch: branch || null },
	};
};

export default RepoStatsPage;
