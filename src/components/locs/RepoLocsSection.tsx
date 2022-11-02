import { Block } from "@/components/Block";
import { Input } from "@/components/Input";
import { FileTree } from "@/components/locs/FileTree";
import { LocsTree } from "@/components/locs/LocsTree";
import { PathBreadcrumb } from "@/components/locs/PathBreadcrumb";
import { Select, SelectOption } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { Spacer } from "@/components/Spacer";
import { useDebounce } from "@/hooks/useDebounce";
import { isFolder, SortOrder, useLocs } from "@/hooks/useLocs";
import { formatNumber } from "@/lib/format";
import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { Heading } from "../Heading";
import { FilePreview } from "./FilePreview";
import { FilterHelpTooltip } from "./FilterHelpTooltip";

type Props = {
	owner: string;
	repo: string;
	branch?: string | null;
	defaultBranch?: string;
};

const sortOrders: Record<SortOrder, SelectOption> = {
	type: { name: "Type" },
	locs: { name: "Locs" },
} as const;

export const RepoLocsSection = ({
	owner,
	repo,
	branch,
	defaultBranch,
}: Props) => {
	const router = useRouter();
	const filterParam =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search).get("filter") || ""
			: "";

	const [filter, setFilter] = useState<string>(filterParam);
	const debouncedFilter = router.query.filter as string | undefined;
	useDebounce(
		() => {
			if (router.isReady) {
				const query = router.query;
				delete query.filter;

				router.replace(
					{
						query: {
							...query,
							...(filter && { filter }),
						},
					},
					undefined,
					{ scroll: false, shallow: true }
				);
			}
		},
		750,
		[filter]
	);

	const [sortOrder, setSortOrder] = useState<SortOrder>("type");
	const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
		null
	);

	let path: string[];
	try {
		path = JSON.parse(router.query.locsPath as string);
	} catch (e) {
		path = [];
	}
	const setPath = (newPath: string[]) => {
		const query = router.query;
		delete query.locsPath;

		router.push(
			{
				pathname: router.pathname,
				query: {
					...query,
					...(newPath.length && {
						locsPath: JSON.stringify(newPath),
					}),
				},
			},
			undefined,
			{ scroll: false, shallow: true }
		);
	};

	const locs = useLocs(path, {
		sortOrder,
		filter: debouncedFilter,
		owner,
		repo,
		branch,
	});

	const isFile = locs !== null && !isFolder(locs);

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

				<div className="flex gap-2 flex-nowrap  ml-auto w-full xs:w-auto">
					<Select
						className="hidden xs:block w-40"
						value={sortOrder}
						options={sortOrders}
						onChange={value => setSortOrder(value as SortOrder)}
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
							value={sortOrder}
							options={sortOrders}
							onChange={value => setSortOrder(value as SortOrder)}
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
								loc={locs}
							/>
						) : (
							<Skeleton
								className="h-80 rounded-md"
								isLoading={!locs}
							>
								<FileTree
									locs={locs!}
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
							Lines of code{" "}
							{locs?.loc !== undefined &&
								`(${formatNumber(locs.loc)})`}
						</Heading>
						<Block>
							<Skeleton
								className="h-80 rounded-md"
								isLoading={!locs}
							>
								{() => (
									<LocsTree
										locs={locs!}
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
