import { Link } from "~/components/Link";
import { bundleJsApi } from "~/lib/bundlejs/api";
import { humanize } from "~/lib/format";
import { ghApi } from "~/lib/github/api";
import { npmApi } from "~/lib/npm/api";
import { CommonSectionProps } from "../types";
import { PackageSectionFallback } from "./PackageSectionFallback";
import { Section } from "./Section";
import { useSSRContext } from "~/lib/context";

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

	let pkg: { name: string; version: string; private?: boolean } | null = null;

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
		timing.timeAsync("bundle", () => bundleJsApi.getPackageSize(pkg.name).catch(() => null)),
		timing.timeAsync("npm", () => npmApi.getPackage(pkg.name).catch(() => null)),
	]);

	const version = bundle?.version.split("@").at(-1);

	const placeholder = <span class="text-muted">failed to load</span>;

	return (
		<Section title="Package">
			<ul>
				<li>
					<Link
						href={`https://www.npmjs.com/package/${pkg.name}`}
						target="_blank"
						rel="noopener"
					>
						{pkg.name}
					</Link>
				</li>
				<li>Version: {version}</li>
				<li>Downloads: {npm ? `${humanize(npm.downloads)} (last week)` : placeholder}</li>
				<li>
					<Link
						href={`https://bundlejs.com/?q=${encodeURIComponent(pkg.name)}`}
						target="_blank"
						rel="noopener"
					>
						Bundle size
					</Link>
					:{" "}
					{bundle
						? `${bundle.size.uncompressedSize} minified (${bundle.size.compressedSize} ${bundle.size.type})`
						: placeholder}
				</li>
				<li>
					<Link
						href={`https://bundlejs.com/?q=${encodeURIComponent(pkg.name)}`}
						target="_blank"
						rel="noopener"
					>
						Install size
					</Link>
					: {bundle ? bundle.installSize.total : placeholder}
				</li>
			</ul>
		</Section>
	);
};
