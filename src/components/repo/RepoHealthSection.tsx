import { RepoHealthResponse } from "@/types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { ComponentType, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Heading } from "../Heading";
import { Skeleton } from "../Skeleton";

type Props = {
	className?: string;
};

const HealthEntry = ({ text, url }: { text: string; url?: string }) => {
	const success = !!url;
	const Icon = success ? CheckCircleIcon : XCircleIcon;

	const Comp = url ? "a" : "span";
	const compProps = url
		? {
				href: url,
				target: "_blank",
				rel: "noreferrer noopener",
		  }
		: {};

	return (
		<li>
			<Comp
				className={classNames(
					"w-max text-subtle flex items-center gap-2 transition-colors duration-75",
					url && "hover:text-link-normal focus:text-link-normal"
				)}
				{...compProps}
			>
				<Icon
					className={classNames(
						"inline-block w-5 h-5",
						success ? "text-success" : "text-error"
					)}
				/>
				<span>{text}</span>
			</Comp>
		</li>
	);
};

export const RepoHealthSection = ({ className }: Props) => {
	const router = useRouter();
	const { owner, repo } = router.query as {
		owner: string;
		repo: string;
	};

	const {
		data: health,
		isLoadingError,
		error,
	} = useQuery<RepoHealthResponse, AxiosError>(
		["repo_health", { owner, repo }],
		() =>
			axios
				.get<RepoHealthResponse>(
					`https://api.github.com/repos/${owner}/${repo}/community/profile`
				)
				.then(response => response.data),
		{
			enabled: router.isReady,
			staleTime: 60 * 60 * 60 * 1000, // 1 hour
		}
	);

	useEffect(() => {
		if (
			isLoadingError &&
			error?.response?.status !== 403 &&
			!axios.isCancel(error)
		) {
			toast.error("Failed to load repo health.");
		}
	}, [isLoadingError, error]);

	const {
		license,
		readme,
		code_of_conduct: coc,
		contributing,
		issue_template: issue,
		pull_request_template: pr,
	} = health?.files ?? {};

	return (
		<article className={classNames("flex flex-col gap-1", className)}>
			<Heading>
				Repo health{" "}
				{health && `(${health.health_percentage.toFixed(0)}%)`}
			</Heading>

			{!health ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 6 }).map((_, index) => (
						<Skeleton
							className="h-4 w-40 odd:w-32 rounded-lg border border-normal"
							key={index}
						/>
					))}
				</div>
			) : (
				<ul className="flex flex-col gap-1 text-sm">
					<HealthEntry
						text={readme ? "Readme" : "No Readme"}
						url={readme?.html_url}
					/>
					<HealthEntry
						text={
							(license?.key === "other"
								? "License"
								: license?.name) || "No license"
						}
						url={license?.html_url}
					/>
					<HealthEntry
						text={
							coc
								? `Code of conduct` +
								  (coc.key === "other" ? "" : ` (${coc.name})`)
								: "No code of conduct"
						}
						url={coc?.html_url}
					/>
					<HealthEntry
						text={
							contributing
								? "Contribution guildelines"
								: "No contribution guidelines"
						}
						url={contributing?.html_url}
					/>
					<HealthEntry
						text={issue ? "Issue template" : "No issue template"}
						url={issue?.html_url}
					/>
					<HealthEntry
						text={
							pr
								? "Pull request template"
								: "No pull request template"
						}
						url={pr?.html_url}
					/>
				</ul>
			)}
		</article>
	);
};
