import { cachedApiFunction } from "../cache";
import { baseFetcher } from "../fetcher";

export interface NpmApiGetPackageResponse {
	pacakge: string;
	downloads: number;
	start: string;
	end: string;
}

export const npmApi = {
	getPackage: cachedApiFunction("npmApi.getPackage", (pkg: string) => {
		return baseFetcher<NpmApiGetPackageResponse>(
			`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
		);
	}),
};
