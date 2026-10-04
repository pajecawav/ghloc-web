import { ghlocApi, type Locs } from "./ghloc/api";
import { sleep } from "./utils";

/** How long a repo page render waits for a live LOC fetch before shipping generic meta. */
const LOC_META_TIMEOUT_MS = 2_000;

export interface RepoLocMeta {
	branch: string;
	loc: number;
	langs: Record<string, number>;
	/** Top-level children: files map to their loc, folders map to the subtree total. */
	top: Record<string, number | { loc: number }>;
}

/**
 * Converts freshly fetched locs into a `Locs` object suitable for seeding the
 * LocsSection island: top-level children are flattened so the serialized
 * prop stays small.
 */
export const locMetaToLocs = (meta: RepoLocMeta): Locs => {
	return {
		loc: meta.loc,
		locByLangs: meta.langs,
		children: meta.top,
	};
};

const locsToMeta = (locs: Locs, branch: string): RepoLocMeta => {
	const top: RepoLocMeta["top"] = {};

	for (const [name, child] of Object.entries(locs.children ?? {})) {
		top[name] = typeof child === "number" ? child : { loc: child.loc };
	}

	return { branch, loc: locs.loc, langs: locs.locByLangs ?? {}, top };
};

export interface ResolveLocMetaParams {
	owner: string;
	repo: string;
	branch: string;
	/** Filtered variants must not show unfiltered numbers. */
	filter?: string;
}

/**
 * Resolves LOC metadata for SEO meta tags: races a live ghloc fetch against a
 * short timeout so TTFB stays bounded — repos that resolve in time get real
 * numbers in their title/description, slow ones ship generic meta.
 */
export const resolveLocMeta = async ({
	owner,
	repo,
	branch,
	filter,
}: ResolveLocMetaParams): Promise<RepoLocMeta | null> => {
	if (filter) {
		return null;
	}

	const locs = await Promise.race([
		ghlocApi.getLocs({ owner, repo, branch }).catch(() => null),
		sleep(LOC_META_TIMEOUT_MS).then(() => null),
	]);

	if (!locs || (!locs.loc && Object.keys(locs.locByLangs ?? {}).length === 0)) {
		return null;
	}

	return locsToMeta(locs, branch);
};
