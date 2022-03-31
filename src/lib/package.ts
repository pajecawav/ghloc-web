import { getRawGitHubUrl } from "./github";

type BundlephobiaResponse = {
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

async function fetchPackagephobiaData(
	name: string
): Promise<PackagephobiaResponse> {
	const res = await fetch(
		`https://packagephobia.com/v2/api.json?p=${encodeURIComponent(name)}`
	);

	if (!res.ok) {
		throw new Error(`Failed to load package data for '${name}'`);
	}

	return res.json();
}

type PackagephobiaResponse = {
	name: string;
	version: string;
	publish: {
		bytes: number;
		files: number;
		pretty: string;
		color: string;
	};
	install: {
		bytes: number;
		files: number;
		pretty: string;
		color: string;
	};
};

async function fetchBundlephobiaData(
	name: string
): Promise<BundlephobiaResponse> {
	const res = await fetch(
		`https://bundlephobia.com/api/size?package=${encodeURIComponent(name)}`
	);

	if (!res.ok) {
		throw new Error(`Failed to load bundle data for '${name}'`);
	}

	return res.json();
}

export type PackageInfo = {
	bundle: BundlephobiaResponse;
	package: PackagephobiaResponse;
};

export async function getPackageInfo({
	owner,
	repo,
	branch,
}: {
	owner: string;
	repo: string;
	branch: string;
}): Promise<PackageInfo | null> {
	const packageUrl = getRawGitHubUrl({
		owner,
		repo,
		branch,
		path: "package.json",
	});

	const res = await fetch(packageUrl);

	if (!res.ok) {
		return null;
	}

	let pkg;
	try {
		pkg = await res.json();
	} catch (e) {
		return null;
	}

	if (!pkg.name || pkg.private) {
		return null;
	}

	const [bundleInfo, packageInfo] = await Promise.all([
		fetchBundlephobiaData(pkg.name),
		fetchPackagephobiaData(pkg.name),
	]);

	return { bundle: bundleInfo, package: packageInfo };
}
