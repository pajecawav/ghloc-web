import { PropsWithChildren } from "hono/jsx";
import useSWRImmutable from "swr/immutable";
import { ExternalLinkIcon } from "~/components/icons/ExternalLinkIcon";
import { Link } from "~/components/Link";
import { Skeleton } from "~/components/Skeleton";
import { formatBytes } from "~/lib/format";
import { ghApi } from "~/lib/github/api";
import { getGitHubFileUrl, getRawGitHubFileUrl } from "~/lib/github/utils";
import { getLanguageFromExtension } from "~/lib/languages";
import { CodePreview } from "./CodePreview";

// TODO: lazy import
// const LazyCodePreview = lazy(() => import("./CodePreview"));

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

	const { data: metaData } = useSWRImmutable(
		["fileMeta", owner, repo, branch, path],
		() => ghApi.getFileMeta(owner, repo, path, branch),
		{ keepPreviousData: true },
	);

	const isSupported = metaData?.type;

	const { data: fileData } = useSWRImmutable(
		isSupported ? ["file", owner, repo, branch, path] : null,
		() => ghApi.getFile(owner, repo, path, branch),
		{ keepPreviousData: true },
	);

	if (!metaData || (isSupported && fileData === undefined)) {
		return <Skeleton class="h-96" />;
	}

	switch (metaData.type) {
		case null:
			return <UnsupportedFile url={url} size={metaData.size} />;
		case "text":
			return (
				<PlainTextFile
					path={path}
					text={fileData!}
					size={metaData.size}
					loc={loc}
					owner={owner}
					repo={repo}
					branch={branch}
				/>
			);
		case "image":
			return <ImageFile url={url} size={metaData.size} />;
	}
};

const Header = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex items-center gap-2 rounded-t-md border-b border-border bg-gray-100 px-4 py-2 text-xs text-muted dark:bg-neutral-800">
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

const PlainTextFile = ({
	path,
	text,
	loc,
	size,
	owner,
	repo,
	branch,
}: {
	path: string;
	text: string;
	loc: number;
	size: number;
	owner: string;
	repo: string;
	branch: string;
}) => {
	// ignore traling empty line
	const lines = text.trimEnd().split("\n");

	const extension = path.split(".").pop();
	const filename = path.split("/").pop();
	const language = extension
		? (getLanguageFromExtension(extension, filename) ?? extension)
		: extension;

	const githubUrl = getGitHubFileUrl(owner, repo, branch, path);

	return (
		<div>
			<Header>
				<span>
					{lines.length} lines ({loc} sloc){" "}
					<span className="mx-1 inline-block text-muted">|</span> {formatBytes(size)}
				</span>
				<a
					className="ml-auto transition-colors hover:text-link"
					href={githubUrl}
					target="_blank"
					rel="noopener"
					title="Open file on GitHub"
				>
					<ExternalLinkIcon class="h-4 w-4" />
				</a>
			</Header>
			<div className="overflow-x-auto py-1 font-mono text-sm whitespace-nowrap">
				<CodePreview lang={language} code={text} />
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
