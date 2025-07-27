import { cachedApiFunction } from "../cache";

interface NpmApiGetPackageResponse {
	pacakge: string;
	downloads: number;
	start: string;
	end: string;
}

export const npmApi = {
	getPackage: cachedApiFunction("npmApi.getPackage", (pkg: string) => {
		return $fetch<NpmApiGetPackageResponse>(
			`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
		);
	}),
};
