import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Skeleton } from "../Skeleton";

type Props = {
	owner: string;
	repo: string;
	branch: string;
	path: string[];
};

export const FilePreview = ({ owner, repo, branch, path }: Props) => {
	const { data: file, isLoadingError } = useQuery<string, AxiosError>(
		["files", { owner, repo, branch, path }],
		() =>
			axios
				.get<string>(
					`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path.join(
						"/"
					)}`,
					{
						// response is plain text
						transformResponse: text => text,
					}
				)
				.then(response => response.data),
		{
			staleTime: 30 * 60 * 60 * 1000, // 30 minutes
		}
	);

	useEffect(() => {
		if (isLoadingError) {
			toast.error(`Failed to fetch file.`);
		}
	}, [isLoadingError]);

	const lines = file?.split("\n");

	return (
		<Skeleton className="h-96" isLoading={!file}>
			{() => (
				<div className="py-1 overflow-auto">
					<table className="text-sm font-mono whitespace-nowrap">
						<tbody>
							{lines?.map(
								(line, index) =>
									// ignore traling empty line
									(line || index + 1 !== lines.length) && (
										<tr key={index}>
											<td className="min-w-[3rem] px-3 text-muted-text text-right select-none">
												{index + 1}
											</td>
											<td className="pr-3">
												<pre>{line}</pre>
											</td>
										</tr>
									)
							)}
						</tbody>
					</table>
				</div>
			)}
		</Skeleton>
	);
};
