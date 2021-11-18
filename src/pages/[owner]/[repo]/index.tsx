import classNames from "classnames";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { LocsStats } from "../../../components/locs/LocsStats";
import { LocsTree } from "../../../components/locs/LocsTree";
import { PathBreadcrumb } from "../../../components/locs/PathBreadcrumb";
import { Locs, LocsChild } from "../../../types";
import DefaultErrorPage from "next/error";
import { LoadingPlaceholder } from "../../../components/LoadingPlaceholder";
import { BlockLoadingPlaceholder } from "../../../components/BlockLoadingPlaceholder";
import { Block } from "../../../components/Block";
import { Input } from "../../../components/Input";
import { Spacer } from "../../../components/Spacer";
import { useDebouncedState } from "../../../hooks/useDebouncedState";

export const RepoStatsPage = () => {
	const {
		state: filter,
		debounced: debouncedFilter,
		setState: setFilter,
	} = useDebouncedState("", 1000);

	const router = useRouter();
	const [path, setPath] = useState<string[]>([]);

	const { owner, repo } = router.query as {
		owner: string;
		repo: string;
	};

	const locsQuery = useQuery<Locs, number>(
		["stats", { owner, repo, filter: debouncedFilter }],
		async () => {
			const response = await fetch(
				`https://ghloc.bytes.pw/${owner}/${repo}` +
					(debouncedFilter
						? `?filter=${encodeURIComponent(debouncedFilter)}`
						: "")
			);

			if (!response.ok) {
				throw response.status;
			}

			return response.json();
		},
		{ enabled: router.isReady }
	);

	if (locsQuery.isError) {
		return <DefaultErrorPage statusCode={locsQuery.error} />;
	}

	if (locsQuery.isLoading || locsQuery.isIdle) {
		// TODO: use skeletons
		return (
			<div className="w-screen h-screen grid place-items-center">
				<LoadingPlaceholder className="h-10 w-10" />
			</div>
		);
	}

	let pathLocs = locsQuery.data;
	for (const name of path) {
		// TODO: check if children exist
		pathLocs = pathLocs.children![name] as Locs;
	}

	return (
		<div className="max-w-3xl p-4 mx-auto flex flex-col gap-2">
			<div className="flex gap-2">
				<PathBreadcrumb
					path={[repo, ...path]}
					onSelect={index =>
						setPath(index === 0 ? [] : path.slice(0, index))
					}
				/>
				<Spacer className="hidden sm:block" />
				<Input
					className="self-end w-40"
					placeholder="Filter"
					value={filter}
					onChange={e => setFilter(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Block className="self-start order-last sm:order-first">
					<LocsTree
						locs={pathLocs}
						onSelect={name => setPath(prev => [...prev, name])}
					/>
				</Block>
				<Block className="self-start">
					<LocsStats locs={pathLocs} />
				</Block>
			</div>
		</div>
	);
};

export default RepoStatsPage;
