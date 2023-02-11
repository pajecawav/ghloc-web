import { ServerTiming } from "tiny-server-timing";
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

type PackageInfoOptions = {
	owner: string;
	repo: string;
	branch: string;
};

export async function getPackageInfo(
	{ owner, repo, branch }: PackageInfoOptions,
	timing?: ServerTiming
): Promise<PackageInfo | null> {
	const packageUrl = getRawGitHubUrl({
		owner,
		repo,
		branch,
		path: "package.json",
	});

	timing?.start("github");
	const res = await fetch(packageUrl);
	timing?.end("github");

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
		fetchBundlephobiaData(pkg.name, timing),
		fetchPackagephobiaData(pkg.name, timing),
		fetchNpmData(pkg.name, timing),
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
