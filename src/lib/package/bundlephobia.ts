export async function fetchBundlephobiaData(
	name: string
): Promise<BundlephobiaData> {
	const res = await fetch(
		`https://bundlephobia.com/api/size?package=${encodeURIComponent(name)}`
	);

	if (!res.ok) {
		throw new Error(`Failed to load bundle data for '${name}'`);
	}

	return res.json();
}

export type BundlephobiaData = {
	assets: {
		gzip: number;
		name: string;
		size: number;
		type: string;
	}[];
	dependencyCount: number;
	dependencySizes: {
		approximateSize: number;
		name: string;
	};
	description: string;
	gzip: number;
	hasJSModule: string;
	hasJSNext: boolean;
	hasSideEffects: string[];
	ignoredMissingDependencies: string[];
	isModuleType: boolean;
	name: string;
	peerDependencies: string[];
	repository: string;
	scoped: boolean;
	size: number;
	version: string;
};
