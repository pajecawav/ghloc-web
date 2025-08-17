import { bundleJsApi } from "~/lib/bundlejs/api";
import { useSSRContext } from "~/lib/context";
import { ghApi } from "~/lib/github/api";
import { Island } from "~/lib/island";
import { npmApi } from "~/lib/npm/api";
import PackageSectionContent from "./PackageSectionContent.island.lazy";
import { PackageSectionFallback } from "./PackageSectionFallback";
import { PackageJson } from "./types";
import { CommonSectionProps } from "../../types";

interface PackageSectionProps extends CommonSectionProps {
	branch: string;
}

export const PackageSection = async ({ owner, repo, branch }: PackageSectionProps) => {
	const { timing } = useSSRContext();

	let packageJsonRaw;
	try {
		packageJsonRaw = await timing.timeAsync("pkgJson", () =>
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
		timing.timeAsync("bundle", () =>
			bundleJsApi.getPackageSize(pkg.name, 3_000).catch(() => null),
		),
		timing.timeAsync("npm", () => npmApi.getPackage(pkg.name).catch(() => null)),
	]);

	const props = { pkg, bundle, npm };

	if (bundle === null) {
		return <Island Component={PackageSectionContent} props={props} />;
	}

	return <PackageSectionContent {...props} />;
};
