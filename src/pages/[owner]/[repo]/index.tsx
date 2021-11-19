import { Block } from "@/components/Block";
import { Input } from "@/components/Input";
import { LocsStats } from "@/components/locs/LocsStats";
import { LocsTree } from "@/components/locs/LocsTree";
import { PathBreadcrumb } from "@/components/locs/PathBreadcrumb";
import { Skeleton } from "@/components/Skeleton";
import { Spacer } from "@/components/Spacer";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { Locs } from "@/types";
import { GetServerSideProps } from "next";
import DefaultErrorPage from "next/error";
import React, { useState } from "react";
import { useQuery } from "react-query";

type Props = {
	owner: string;
	repo: string;
	branch?: string;
};

export const RepoStatsPage = ({ owner, repo, branch }: Props) => {
	const {
		state: filter,
		debounced: debouncedFilter,
		setState: setFilter,
	} = useDebouncedState("", 1000);

	const [path, setPath] = useState<string[]>([]);

	const locsQuery = useQuery<Locs, number>(
		["stats", { owner, repo, branch, filter: debouncedFilter }],
		async () => {
			const response = await fetch(
				`https://ghloc.bytes.pw/${owner}/${repo}` +
					(branch ? `/${branch}` : "") +
					(debouncedFilter
						? `?filter=${encodeURIComponent(debouncedFilter)}`
						: "")
			);

			if (!response.ok) {
				throw response.status;
			}

			return response.json();
		},
		{ keepPreviousData: true }
	);

	if (locsQuery.isError) {
		return <DefaultErrorPage statusCode={locsQuery.error} />;
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
			<div className="flex items-center gap-2">
				<PathBreadcrumb
					className="py-1"
					path={[repo, ...path]}
					onSelect={index =>
						setPath(index === 0 ? [] : path.slice(0, index))
					}
				/>
				<Spacer />
				<Input
					className="self-end w-40 flex-shrink-0"
					placeholder="Filter"
					value={filter}
					onChange={e => setFilter(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Block className="self-start order-last sm:order-first">
					{pathLocs ? (
						<LocsTree
							locs={pathLocs}
							onSelect={name => setPath(prev => [...prev, name])}
						/>
					) : (
						<Skeleton className="h-80" />
					)}
				</Block>
				<Block className="self-start">
					{pathLocs ? (
						<LocsStats locs={pathLocs} />
					) : (
						<Skeleton className="h-80" />
					)}
				</Block>
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
		props: { owner, repo, branch },
	};
};

export default RepoStatsPage;
