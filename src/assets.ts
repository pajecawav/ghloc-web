import type { Manifest, ManifestChunk } from "vite";
import { ensureLeadingSlash } from "./lib/utils";

interface GetAssetsOptions {
	manifest: Manifest;
	clientEntry: string;
}

export interface Assets {
	css: string[];
	script: string;
	preloads: string[];
}

export const getAssets = ({ manifest, clientEntry }: GetAssetsOptions): Assets => {
	const chunk = manifest[clientEntry];
	const script = ensureLeadingSlash(chunk.file);

	const css = chunk.css?.map(link => ensureLeadingSlash(link)) ?? [];
	const preloads = [];

	const importedChunks = getImportedChunks(manifest, clientEntry);

	for (const chunk of importedChunks) {
		preloads.push(ensureLeadingSlash(chunk.file));
		css.push(...(chunk.css?.map(link => ensureLeadingSlash(link)) ?? []));
	}

	return { css, script, preloads };
};

const getImportedChunks = (manifest: Manifest, name: string): ManifestChunk[] => {
	const seen = new Set<string>();

	const innerGetImportedChunks = (chunk: ManifestChunk): ManifestChunk[] => {
		const chunks: ManifestChunk[] = [];
		for (const file of chunk.imports ?? []) {
			const importee = manifest[file];
			if (seen.has(file)) {
				continue;
			}
			seen.add(file);

			chunks.push(...innerGetImportedChunks(importee));
			chunks.push(importee);
		}

		return chunks;
	};

	return innerGetImportedChunks(manifest[name]);
};
