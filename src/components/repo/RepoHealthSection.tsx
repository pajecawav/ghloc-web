import { getCommunityProfile, RepoHealthResponse } from "@/lib/github";
import { queryKeys } from "@/lib/query-keys";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import type { FetchError } from "ohmyfetch";
import toast from "react-hot-toast";
import { Heading } from "../Heading";
import { Skeleton } from "../Skeleton";

type Props = {
	owner: string;
	repo: string;
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

export const RepoHealthSection = ({ owner, repo, className }: Props) => {
	const {
		data: health,
		isLoadingError,
		error,
	} = useQuery({
		queryKey: queryKeys.repoHealth({ owner, repo }),
		queryFn: () => getCommunityProfile({ owner, repo }),
		onError() {
			toast.error("Failed to load repo health.");
		},
	});

	const {
		license,
		readme,
		code_of_conduct: coc,
		contributing,
		issue_template: issue,
		pull_request_template: pr,
	} = health?.files ?? {};

	return (
		<div className={classNames("flex flex-col gap-1", className)}>
			<Heading>
				Repo health{" "}
				{health && `(${health.health_percentage.toFixed(0)}%)`}
			</Heading>

			{!health ? (
				<div className="flex flex-col">
					{Array.from({ length: 6 }).map((_, index) => (
						<Skeleton
							className="h-6 w-40 odd:w-24 rounded-md border border-normal"
							isText={true}
							key={index}
						/>
					))}
				</div>
			) : (
				<ul className="flex flex-col">
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
		</div>
	);
};
