import { JSX } from "hono/jsx";
import { Manifest } from "vite";
import { ensureLeadingSlash, removeLeadingSlash } from "./utils";

export interface PreloadEntry {
	rel?: "preload" | "modulepreload";
	href: string;
	as: string;
	crossorigin?: JSX.CrossOrigin;
}

export const getPreloadForModule = (src: string, manifest: Manifest): PreloadEntry[] | null => {
	const chunk = manifest[removeLeadingSlash(src)];

	if (!chunk) {
		return null;
	}

	const preload: Array<PreloadEntry> = [
		{
			rel: "modulepreload",
			href: ensureLeadingSlash(chunk.file),
			as: "script",
			crossorigin: "",
		},
	];

	// TODO: check nested preloads are needed
	// for (const imp of chunk.imports ?? []) {
	// 	preload.push(...(getPreloadForModule(imp, manifest) ?? []));
	// }

	return preload;
};
