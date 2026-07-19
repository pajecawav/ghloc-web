import { useEvent } from "@pajecawav/yamf";
import { withServerTiming } from "nitro/h3";
import { bundleJsApi } from "~/lib/bundlejs/api";
import { ghApi } from "~/lib/github/api";
import { npmApi } from "~/lib/npm/api";
import type { CommonSectionProps } from "../../types";
import PackageSectionContent from "./PackageSectionContent.island";
import { PackageSectionFallback } from "./PackageSectionFallback";
import type { PackageJson } from "./types";

interface PackageSectionProps extends CommonSectionProps {
	branch: string;
}

export const PackageSection = async ({ owner, repo, branch }: PackageSectionProps) => {
	const event = useEvent();

	let packageJsonRaw;
	try {
		packageJsonRaw = await withServerTiming(event, "pkgJson", () =>
			ghApi.getFile(owner, repo, "package.json", branch),
		);
	} catch (error) {
		console.error(error);

		return <PackageSectionFallback />;
	}

	let pkg: PackageJson | null = null;

	try {
		pkg = JSON.parse(packageJsonRaw);
	} catch {
		/* empty */
	}

	if (!pkg || !pkg.name || pkg.private) {
		return (
			<PackageSectionFallback>
				No npm package detected in the project root.
			</PackageSectionFallback>
		);
	}

	const [bundle, npm] = await Promise.all([
		withServerTiming(event, "bundle", () =>
			bundleJsApi.getPackageSize(pkg.name, 1_000).catch(() => null),
		),
		withServerTiming(event, "npm", () => npmApi.getPackage(pkg.name).catch(() => null)),
	]);

	return <PackageSectionContent pkg={pkg} bundle={bundle} npm={npm} />;
};
