import { cachedApiFunction } from "../cache";
import { baseFetcher } from "../fetcher";

export type LocsChild = Locs | number;

export interface Locs {
	loc: number;
	locByLangs?: Record<string, number>;
	children?: Record<string, LocsChild>;
}

export type GhlocApiGetLocsResponse = Locs;

export interface GhlocApiGetLocsParams {
	owner: string;
	repo: string;
	branch?: string;
	filter?: string;
	activeFilters?: string[];
}

export const getGhlocGetLocsUrl = ({ owner, repo, branch, filter }: GhlocApiGetLocsParams) => {
	const url = new URL(`https://ghloc.ifels.dev/${owner}/${repo}`);

	if (branch) {
		url.pathname += `/${branch}`;
	}

	if (filter) {
		url.searchParams.set("match", filter);
	}

	url.searchParams.set("pretty", "false");

	return url;
};

export const FILTER_CATEGORIES = [
	{
		id: "jsonConfigs",
		label: "JSON Configs",
		patterns: [
			/^package\.json$/i,
			/^tsconfig.*\.json$/i,
			/^jsconfig.*\.json$/i,
			/^composer\.json$/i,
			/^angular\.json$/i,
			/^nx\.json$/i,
			/^lerna\.json$/i,
		],
	},
	{
		id: "lockfiles",
		label: "Lockfiles",
		patterns: [
			/lock$/i,
			/pnpm-lock\.yaml$/i,
			/^go\.sum$/i,
		],
	},
	{
		id: "buildScripts",
		label: "Build Scripts",
		patterns: [
			/gradle$/i,
			/^gradlew$/i,
			/^gradlew\.bat$/i,
			/^makefile$/i,
			/^pom\.xml$/i,
			/^build\.xml$/i,
			/^cargo\.toml$/i,
			/vite\.config\./i,
			/webpack\.config\./i,
			/rollup\.config\./i,
			/jest\.config\./i,
			/babel\.config\./i,
			/tailwind\.config\./i,
			/postcss\.config\./i,
			/^go\.mod$/i,
		],
	},
	{
		id: "environment",
		label: "Environment & CI/CD",
		patterns: [
			/^\.env/i,
			/^dockerfile$/i,
			/^docker-compose\./i,
			/^jenkinsfile$/i,
			/^gemfile$/i,
			/^requirements\.txt$/i,
			/^pyproject\.toml$/i,
			/^setup\.py$/i,
		],
	},
	{
		id: "editorGit",
		label: "Editor & Git",
		patterns: [
			/^\.gitignore$/i,
			/^\.gitattributes$/i,
			/^\.editorconfig$/i,
			/^\.eslintrc/i,
			/^\.prettierrc/i,
		],
	},
	{
		id: "cachesAndBinaries",
		label: "Caches & Assets",
		patterns: [
			/\.tsbuildinfo$/i,
			/\.properties$/i,
			/\.pro$/i,
			/\.(png|jpe?g|gif|svg|webp|ico|zip|tar|gz|rar|7z)$/i,
		],
	},
];

function isIgnored(filename: string, activeFilters: string[]): boolean {
	for (const category of FILTER_CATEGORIES) {
		if (activeFilters.includes(category.id)) {
			if (category.patterns.some((p) => p.test(filename))) {
				return true;
			}
		}
	}
	return false;
}

function guessLanguageBucket(filename: string): string {
	const lastDot = filename.lastIndexOf(".");
	if (lastDot !== -1 && lastDot !== 0) {
		return filename.slice(lastDot);
	}
	return filename;
}

function filterIgnoredFiles(locs: Locs, activeFilters: string[], name = ""): Locs | null {
	if (name && isIgnored(name, activeFilters)) return null;

	const newLocs: Locs = {
		loc: locs.loc,
		locByLangs: locs.locByLangs ? { ...locs.locByLangs } : undefined,
		children: locs.children ? { ...locs.children } : undefined,
	};

	if (locs.children) {
		const newChildren: Record<string, LocsChild> = {};
		for (const [childName, childValue] of Object.entries(locs.children)) {
			if (isIgnored(childName, activeFilters)) {
				let droppedLoc = typeof childValue === "number" ? childValue : childValue.loc;
				newLocs.loc -= droppedLoc;

				if (newLocs.locByLangs) {
					if (typeof childValue === "number") {
						const bucket = guessLanguageBucket(childName);
						if (newLocs.locByLangs[bucket] !== undefined) {
							newLocs.locByLangs[bucket] -= droppedLoc;
							if (newLocs.locByLangs[bucket] <= 0) {
								delete newLocs.locByLangs[bucket];
							}
						}
					} else if (childValue.locByLangs) {
						for (const [lang, count] of Object.entries(childValue.locByLangs)) {
							if (newLocs.locByLangs[lang] !== undefined) {
								newLocs.locByLangs[lang] -= count;
								if (newLocs.locByLangs[lang] <= 0) {
									delete newLocs.locByLangs[lang];
								}
							}
						}
					}
				}
			} else {
				if (typeof childValue !== "number") {
					const filteredChild = filterIgnoredFiles(childValue, activeFilters, childName);
					if (filteredChild) {
						newChildren[childName] = filteredChild;
						const diff = childValue.loc - filteredChild.loc;
						if (diff > 0) {
							newLocs.loc -= diff;
							if (newLocs.locByLangs && childValue.locByLangs && filteredChild.locByLangs) {
								for (const lang of Object.keys(childValue.locByLangs)) {
									const oldL = childValue.locByLangs[lang] || 0;
									const newL = filteredChild.locByLangs[lang] || 0;
									const langDiff = oldL - newL;
									if (langDiff > 0 && newLocs.locByLangs[lang] !== undefined) {
										newLocs.locByLangs[lang] -= langDiff;
										if (newLocs.locByLangs[lang] <= 0) {
											delete newLocs.locByLangs[lang];
										}
									}
								}
							}
						}
					}
				} else {
					newChildren[childName] = childValue;
				}
			}
		}
		newLocs.children = newChildren;
	}

	return newLocs;
}

export const ghlocApi = {
	getLocs: cachedApiFunction("ghlocApi.getLocs", async (params: GhlocApiGetLocsParams) => {
		const url = getGhlocGetLocsUrl(params);
		const data = await baseFetcher<GhlocApiGetLocsResponse>(url.toString());
		const activeFilters = params.activeFilters ?? [];
		return activeFilters.length > 0 ? (filterIgnoredFiles(data, activeFilters) || { loc: 0 }) : data;
	}),
};
