import { IslandProps } from "@pajecawav/yamf";
import useSWRImmutable from "swr/immutable";
import { Link } from "~/components/Link";
import { Skeleton } from "~/components/Skeleton";
import { bundleJsApi, type BundleJsApiGetPackageSizeResponse } from "~/lib/bundlejs/api";
import { humanize } from "~/lib/format";
import type { NpmApiGetPackageResponse } from "~/lib/npm/api";
import { Section } from "../Section";
import { PackageSectionFallback } from "./PackageSectionFallback";

interface PackageSectionContentProps extends IslandProps {
	packageName: string;
	packageVersion: string;
	bundle: BundleJsApiGetPackageSizeResponse | null;
	npm: NpmApiGetPackageResponse | null;
}

export default function PackageSectionContent({
	packageName,
	packageVersion,
	bundle: _bundle,
	npm,
}: PackageSectionContentProps) {
	const { data: bundle, error } = useSWRImmutable(
		_bundle === null ? ["bundle", packageName] : null,
		() => bundleJsApi.getPackageSize(packageName),
		{ fallbackData: _bundle ?? undefined },
	);

	const title = "Package";

	const placeholder = <span class="text-muted">failed to load</span>;

	if (error) {
		return <PackageSectionFallback />;
	}

	if (!bundle) {
		return (
			<Section title={title}>
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

	return (
		<Section title={title}>
			<ul>
				<li>
					<Link
						href={`https://npmx.dev/package/${packageName}`}
						target="_blank"
						rel="noopener"
					>
						{packageName}
					</Link>
				</li>
				<li>Version: {packageVersion}</li>
				<li>Downloads: {npm ? `${humanize(npm.downloads)} (last week)` : placeholder}</li>
				<li>
					<Link
						href={`https://bundlejs.com/?q=${encodeURIComponent(packageName)}`}
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
						href={`https://bundlejs.com/?q=${encodeURIComponent(packageName)}`}
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
