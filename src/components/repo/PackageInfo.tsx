import { formatSize } from "@/lib/format";
import { PackageInfo as PackageInfoResponse } from "@/lib/package";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Heading } from "../Heading";
import { Skeleton } from "../Skeleton";

export const PackageInfo = () => {
	const router = useRouter();
	const { owner, repo, branch } = router.query as {
		owner: string;
		repo: string;
		branch?: string;
	};

	const enabled = router.isReady && !!branch;

	const { data, isLoading, isLoadingError, error } = useQuery<
		PackageInfoResponse,
		AxiosError
	>(
		["package_info", { owner, repo, branch }],
		() =>
			axios
				.get<{ data: PackageInfoResponse }>(`/api/package`, {
					params: { owner, repo, branch },
				})
				.then(response => response.data.data),
		{
			enabled,
			staleTime: 60 * 60 * 60 * 1000, // 1 hour
		}
	);

	return (
		<div className={classNames("flex flex-col gap-1")}>
			<Heading>Package</Heading>

			{isLoading || !enabled ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton
							className="h-4 w-32 first:w-52 rounded-lg border border-normal"
							key={index}
						/>
					))}
				</div>
			) : !data ? (
				<p className="text-muted">No npm package detected.</p>
			) : (
				<ul>
					<li>
						<a
							className="text-link-normal hover:underline"
							href={`https://bundlephobia.com/package/${data.bundle.name}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Bundle size
						</a>
						: {formatSize(data.bundle.size)} minified (
						{formatSize(data.bundle.gzip)} gzipped)
					</li>
					<li>
						<a
							className="text-link-normal hover:underline"
							href={`https://packagephobia.com/result?p=${data.bundle.name}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Install size
						</a>
						: {formatSize(data.package.install.bytes)}
					</li>
					<li>
						<a
							className="text-link-normal hover:underline"
							href={`https://packagephobia.com/result?p=${data.bundle.name}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Publish size
						</a>
						: {formatSize(data.package.publish.bytes)}
					</li>
				</ul>
			)}
		</div>
	);
};
