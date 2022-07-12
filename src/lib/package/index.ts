import { getRawGitHubUrl } from "../github";
import { BundlephobiaData, fetchBundlephobiaData } from "./bundlephobia";
import { fetchNpmData, NpmData } from "./npm";
import { fetchPackagephobiaData, PackagephobiaData } from "./packagephobia";

export type PackageInfo = {
	name: string;
	bundle: BundlephobiaData | null;
	package: PackagephobiaData | null;
	npm: NpmData | null;
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

	const [bundleData, packageData, npmData] = await Promise.allSettled([
		fetchBundlephobiaData(pkg.name),
		fetchPackagephobiaData(pkg.name),
		fetchNpmData(pkg.name),
	]);

	const bundleInfo =
		bundleData.status === "fulfilled" ? bundleData.value : null;
	const packageInfo =
		packageData.status === "fulfilled" ? packageData.value : null;
	const npmInfo = npmData.status === "fulfilled" ? npmData.value : null;

	return {
		name: pkg.name as string,
		bundle: bundleInfo,
		package: packageInfo,
		npm: npmInfo,
	};
}
