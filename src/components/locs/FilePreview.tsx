import { formatSize } from "@/lib/format";
import { getRawGitHubUrl } from "@/lib/github";
import { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../Skeleton";
import { $fetch, FetchError } from "ohmyfetch";
import { queryKeys } from "@/lib/query-keys";

type FileType = "text" | "image";

const FileHeading = ({ children }: { children: ReactNode }) => {
	return (
		<div className="bg-accent text-subtle px-4 py-2 text-xs border-b border-normal">
			{children}
		</div>
	);
};

const UnsupportedFile = ({ url, size }: { url: string; size: number }) => {
	return (
		<div>
			<FileHeading>{formatSize(size)}</FileHeading>
			<div className="text-center p-4">
				<div className="text-subtle">Unsupported file type</div>
				<div>
					<a
						className="text-link-normal hover:underline"
						href={url}
						target="_blank"
						rel="noreferrer noopener"
					>
						View raw
					</a>
				</div>
			</div>
		</div>
	);
};

const PlainTextFile = ({
	text,
	loc,
	size,
}: {
	text: string;
	loc: number;
	size: number;
}) => {
	// TODO: is this even correct?
	// ignore traling empty line
	const lines = text.split("\n").slice(0, -1);

	return (
		<div>
			<FileHeading>
				{lines.length} lines ({loc} sloc){" "}
				<span className="inline-block text-muted mx-1">|</span>{" "}
				{formatSize(size)}
			</FileHeading>
			<div className="py-1 overflow-auto">
				<table className="text-sm font-mono whitespace-nowrap">
					<tbody>
						{lines.map((line, index) => (
							<tr key={index}>
								<td className="min-w-[3rem] px-3 text-muted text-right select-none">
									{index + 1}
								</td>
								<td className="pr-3">
									<pre>{line}</pre>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const ImageFile = ({ url, size }: { url: string; size: number }) => {
	return (
		<div>
			<FileHeading>{formatSize(size)}</FileHeading>
			<div className="grid place-items-center">
				<img
					className="object-contain object-center"
					src={url}
					alt=""
				/>
			</div>
		</div>
	);
};

type Props = {
	owner: string;
	repo: string;
	branch: string;
	path: string[];
	loc: number;
};

export const FilePreview = ({ owner, repo, branch, path, loc }: Props) => {
	const url = getRawGitHubUrl({ owner, repo, branch, path: path.join("/") });

	// make a HEAD request first to detect file type
	const { data: meta } = useQuery({
		queryKey: ["files", { owner, repo, branch, path }, "type"],
		queryFn: async () => {
			const response = await $fetch.raw(url, { method: "HEAD" });
			const contentType = response.headers.get("content-type")!;
			const size = parseInt(response.headers.get("content-length")!, 10);
			let type: FileType | null = null;
			if (contentType.startsWith("text/plain")) {
				type = "text";
			} else if (contentType.startsWith("image")) {
				type = "image";
			}
			return { type, size };
		},
	});

	const { data: file, isLoadingError } = useQuery({
		queryKey: ["files", { owner, repo, branch, path }],
		queryFn: () =>
			$fetch<string>(url, {
				// response is plain text
				parseResponse: text => text,
			}),
		enabled: !!meta,
		onError() {
			toast.error("Failed to load file.");
		},
	});

	const isReady = file || meta?.type === "image";

	return (
		<Skeleton className="h-96" isLoading={!isReady}>
			{() =>
				meta!.type === null ? (
					<UnsupportedFile url={url} size={meta!.size} />
				) : meta!.type === "text" ? (
					<PlainTextFile text={file!} size={meta!.size} loc={loc} />
				) : (
					<ImageFile url={url} size={meta!.size} />
				)
			}
		</Skeleton>
	);
};
