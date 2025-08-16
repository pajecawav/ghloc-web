import { PropsWithChildren } from "hono/jsx";
import { Link } from "~/components/Link";
import { Skeleton } from "~/components/Skeleton";
import { formatBytes } from "~/lib/format";
import { ghApi } from "~/lib/github/api";
import { getRawGitHubFileUrl } from "~/lib/github/utils";
import { useQuery } from "~/lib/query/useQuery";

interface FilePreviewProps {
	owner: string;
	repo: string;
	branch: string;
	path: string[];
	loc: number;
}

export const FilePreview = ({ owner, repo, branch, path: pathProp, loc }: FilePreviewProps) => {
	const path = pathProp.join("/");
	const url = getRawGitHubFileUrl(owner, repo, branch, path);

	const metaQuery = useQuery({
		queryKey: ["fileMeta", owner, repo, branch, path],
		queryFn: () => ghApi.getFileMeta(owner, repo, path, branch),
	});

	const isSupported = metaQuery.data?.type;

	const fileQuery = useQuery({
		queryKey: ["file", owner, repo, branch, path],
		queryFn: () => ghApi.getFile(owner, repo, path, branch),
		enabled: !!isSupported,
	});

	if (!metaQuery.data || (isSupported && fileQuery.data === undefined)) {
		return <Skeleton class="h-96" />;
	}

	switch (metaQuery.data.type) {
		case null:
			return <UnsupportedFile url={url} size={metaQuery.data.size} />;
		case "text":
			return <PlainTextFile text={fileQuery.data!} size={metaQuery.data.size} loc={loc} />;
		case "image":
			return <ImageFile url={url} size={metaQuery.data.size} />;
	}
};

const Header = ({ children }: PropsWithChildren) => {
	return (
		<div className="text-muted border-border rounded-t-md border-b bg-gray-100 px-4 py-2 text-xs dark:bg-neutral-800">
			{children}
		</div>
	);
};

const UnsupportedFile = ({ url, size }: { url: string; size: number }) => {
	return (
		<div>
			<Header>{formatBytes(size)}</Header>
			<div className="p-8 text-center">
				<div className="text-muted">Unsupported file type</div>
				<Link href={url} target="_blank" rel="noopener">
					View raw
				</Link>
			</div>
		</div>
	);
};

const PlainTextFile = ({ text, loc, size }: { text: string; loc: number; size: number }) => {
	// ignore traling empty line
	const lines = text.split("\n").slice(0, -1);

	return (
		<div>
			<Header>
				{lines.length} lines ({loc} sloc){" "}
				<span className="text-muted mx-1 inline-block">|</span> {formatBytes(size)}
			</Header>
			<div className="overflow-x-auto py-1">
				<table className="font-mono text-sm whitespace-nowrap">
					<tbody>
						{lines.map((line, index) => (
							<tr key={index}>
								<td className="text-muted min-w-[3rem] px-3 text-right select-none">
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
			<Header>{formatBytes(size)}</Header>
			<div className="grid place-items-center">
				<img className="object-contain object-center" src={url} alt="" />
			</div>
		</div>
	);
};
