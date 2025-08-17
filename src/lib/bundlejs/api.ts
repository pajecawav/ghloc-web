import { $fetch } from "ofetch";
import { cachedApiFunction } from "../cache";

export interface BundleJsApiGetPackageSizeResponse {
	query: string;
	rawQuery: string;
	version: string;
	size: {
		type: string; // "gzip";
		rawUncompressedSize: number;
		uncompressedSize: string; //"7.9 kB";
		rawCompressedSize: number;
		compressedSize: string; // "3.46 kB";
		size: string; // "3.46 kB (gzip)";
	};
	installSize: {
		total: string; // "670 kB";
	};
}

export const bundleJsApi = {
	getPackageSize: cachedApiFunction(
		"bundleJsApi.getPackageSize",
		(pkg: string, timeout?: number) => {
			return $fetch<BundleJsApiGetPackageSizeResponse>(
				`https://deno.bundlejs.com/?q=${encodeURIComponent(pkg)}`,
				{ timeout },
			);
		},
	),
};
