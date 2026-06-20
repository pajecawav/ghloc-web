import { useState } from "hono/jsx";
import { Heading } from "~/components/Heading";
import { SpinnerIcon } from "~/components/icons/SpinnerIcon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { Skeleton } from "~/components/Skeleton";
import { useDebouncedValue } from "~/lib/debounce";
import { formatNumber } from "~/lib/format";
import { useRouter } from "~/lib/router/useRouter";
import { cn } from "~/lib/utils";
import { CommonSectionProps } from "~/pages/repo/types";
import { Block } from "./components/Block";
import { FilePreview } from "./components/FilePreview";
import { FileTree } from "./components/FileTree";
import { FilterHelpTooltip } from "./components/FilterTooltip";
import { LocsTree } from "./components/LocsTree";
import { PathBreadcrums } from "./components/PathBreadcrumbs";
import { isFolder, SortOrder, useLocs } from "./hooks/useLocs";

interface LocsSectionProps extends CommonSectionProps {
	branch: string;
}

export default function LocsSection({ owner, repo, branch }: LocsSectionProps) {
	const router = useRouter();

	const [sortOrder, setSortOrder] = useState<SortOrder>("type");
	const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
	const filter = router.search.get("filter") ?? "";
	const [debouncedFilter] = useDebouncedValue(filter, 750);
	const ignoreConfigs = router.search.get("ignoreConfigs") !== "false";

	let path: string[] = [];
	try {
		const locsPath = router.search.get("locsPath");
		if (locsPath) {
			path = JSON.parse(locsPath);
		}
	} catch {
		/* empty */
	}

	const { locs, query } = useLocs(path, {
		sortOrder,
		filter: debouncedFilter,
		ignoreConfigs,
		owner,
		repo,
		branch,
	});

	const setPath = (newPath: string[]) => {
		router.setSearch(prev => {
			if (newPath.length) {
				prev.set("locsPath", JSON.stringify(newPath));
			} else {
				prev.delete("locsPath");
			}

			return prev;
		});
	};

	const setFilter = (newFilter: string) => {
		router.setSearch(
			prev => {
				if (newFilter) {
					prev.set("filter", newFilter);
				} else {
					prev.delete("filter");
				}

				return prev;
			},
			{ replace: true },
		);
	};

	const isFile = locs !== null && !isFolder(locs);

	return (
		<div class="flex flex-col gap-2">
			<div class="flex flex-wrap items-center gap-2">
				<PathBreadcrums
					path={[repo, ...path]}
					onSelect={index => setPath(index === 0 ? [] : path.slice(0, index))}
				/>

				<div class="ml-auto flex w-full flex-col items-end gap-2 xs:w-auto">
					<div class="flex w-full flex-nowrap gap-2">
						<Select
							class="w-28"
							value={sortOrder}
							onChange={e => {
								if (e.target instanceof HTMLSelectElement) {
									setSortOrder(e.target.value as SortOrder);
								}
							}}
							title="Sort order"
						>
							<option value="type">Type</option>
							<option value="locs">Locs</option>
						</Select>

						<div class="w-full xs:w-48 sm:flex-shrink-0 sm:flex-grow-0">
							<Input
								class="w-full"
								placeholder="Filter"
								value={filter}
								onChange={e => {
									if (e.target instanceof HTMLInputElement) {
										setFilter(e.target.value);
									}
								}}
								after={
									(query.status === "fetching" || query.status === "pending") &&
									locs !== null ? (
										<SpinnerIcon class="h-5 w-5 animate-spin text-muted" />
									) : (
										<FilterHelpTooltip />
									)
								}
							/>
						</div>
					</div>
					<label class="flex cursor-pointer items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
						<input
							type="checkbox"
							checked={ignoreConfigs}
							onChange={e => {
								if (e.target instanceof HTMLInputElement) {
									const checked = e.target.checked;
									router.setSearch(
										prev => {
											if (checked) {
												prev.delete("ignoreConfigs");
											} else {
												prev.set("ignoreConfigs", "false");
											}
											return prev;
										},
										{ replace: true }
									);
								}
							}}
							class="rounded border-border text-primary focus:ring-primary h-4 w-4"
						/>
						Ignore config files
					</label>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div
					class={cn(
						"order-last flex flex-col gap-1 self-start sm:order-first",
						isFile && "col-span-1 sm:col-span-2",
					)}
				>
					<section class="flex flex-col">
						<Heading>Files</Heading>
						<Block>
							{isFile ? (
								<FilePreview
									owner={owner}
									repo={repo}
									branch={branch}
									path={path}
									loc={locs}
								/>
							) : !locs ? (
								<Skeleton class="h-80 rounded-md" />
							) : (
								<FileTree
									locs={locs}
									onSelect={name => setPath([...path, name])}
									selectedLanguage={selectedLanguage}
								/>
							)}
						</Block>
					</section>
				</div>

				{!isFile && (
					<section class="flex flex-col">
						<Heading>
							Lines of code {locs?.loc !== undefined && `(${formatNumber(locs.loc)})`}
						</Heading>
						<Block>
							{!locs ? (
								<Skeleton class="h-80 rounded-md" />
							) : (
								<LocsTree
									locs={locs}
									selectedLanguage={selectedLanguage}
									onSelectLanguage={setSelectedLanguage}
								/>
							)}
						</Block>
					</section>
				)}
			</div>
		</div>
	);
}
