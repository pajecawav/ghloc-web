import { Link } from "~/components/Link";
import { Skeleton } from "~/components/Skeleton";
import { bundleJsApi, BundleJsApiGetPackageSizeResponse } from "~/lib/bundlejs/api";
import { humanize } from "~/lib/format";
import { NpmApiGetPackageResponse } from "~/lib/npm/api";
import { useQuery } from "~/lib/query/useQuery";
import { Section } from "../Section";
import { PackageSectionFallback } from "./PackageSectionFallback";
import { PackageJson } from "./types";

interface PackageSectionContentProps {
	pkg: PackageJson;
	bundle: BundleJsApiGetPackageSizeResponse | null;
	npm: NpmApiGetPackageResponse | null;
}

export default function PackageSectionContent({
	pkg,
	bundle: _bundle,
	npm,
}: PackageSectionContentProps) {
	const { data: bundle, status } = useQuery({
		queryKey: ["bundle", pkg.name],
		queryFn: () => bundleJsApi.getPackageSize(pkg.name),
		initialData: _bundle ?? undefined,
	});

	if (status === "error") {
		return <PackageSectionFallback />;
	}

	if (!bundle) {
		return (
			<Section title={<Skeleton class="inline-flex w-24" />}>
				<ul>
					<li>
						<Skeleton class="inline-flex w-16" />
					</li>
					<li>
						<Skeleton class="inline-flex w-36" />
					</li>
					<li>
						<Skeleton class="inline-flex w-36" />
					</li>
					<li>
						<Skeleton class="inline-flex w-44" />
					</li>
					<li>
						<Skeleton class="inline-flex w-24" />
					</li>
				</ul>
			</Section>
		);
	}

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
				<li>Version: {pkg.version}</li>
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
}
