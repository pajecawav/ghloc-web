import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { CheckCircleIcon } from "~/components/icons/CheckCircleIcon";
import { XCircleIcon } from "~/components/icons/XCircleIcon";
import { useSSRContext } from "~/lib/context";
import { ghApi } from "~/lib/github/api";
import { cn } from "~/lib/utils";
import { CommonSectionProps } from "../types";
import { Section } from "./Section";

type HealthSectionProps = CommonSectionProps;

const HealthSectionItem = ({ text, url }: { text: string; url?: string }) => {
	const isSuccess = !!url;
	const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

	const Component = isSuccess ? "a" : "span";
	const componentProps = isSuccess
		? {
				href: url,
				target: "_blank",
				rel: "noopener",
			}
		: {};

	return (
		<li>
			<Component
				class={cn(
					"flex items-center gap-2 transition-colors duration-75",
					isSuccess && "hover:text-link",
				)}
				{...componentProps}
			>
				<Icon
					class={cn(
						"inline-block h-5 w-5 flex-shrink-0",
						isSuccess ? "text-success" : "text-error",
					)}
				/>
				<span class="overflow-hidden text-ellipsis">{text}</span>
			</Component>
		</li>
	);
};

export const HealthSection = async ({ owner, repo, data }: HealthSectionProps) => {
	const { timing } = useSSRContext();

	const title = "Repo health";

	if (data?.fork) {
		return (
			<Section title={title}>
				<ErrorPlaceholder>Health is disabled for forked repos</ErrorPlaceholder>
			</Section>
		);
	}

	let health;
	try {
		health = await timing.timeAsync("heatlh", () => ghApi.getRepoHealth(owner, repo));
	} catch (error) {
		console.error(error);

		return (
			<Section title={title}>
				<ErrorPlaceholder>Failed to load repo health</ErrorPlaceholder>
			</Section>
		);
	}

	const {
		license,
		readme,
		code_of_conduct: coc,
		contributing,
		pull_request_template: pr,
	} = health?.files ?? {};
	let issue = health?.files?.issue_template;

	if (!issue) {
		issue = await timing.timeAsync("issue_template", () => ghApi.getIssueTemplate(owner, repo));
	}

	return (
		<Section title={title}>
			<ul class="flex flex-col items-start">
				<HealthSectionItem text={readme ? "Readme" : "No Readme"} url={readme?.html_url} />
				<HealthSectionItem
					text={(license?.key === "other" ? "License" : license?.name) || "No license"}
					url={license?.html_url}
				/>
				<HealthSectionItem
					text={
						coc
							? `Code of conduct` + (coc.key === "other" ? "" : ` (${coc.name})`)
							: "No code of conduct"
					}
					url={coc?.html_url ?? undefined}
				/>
				<HealthSectionItem
					text={contributing ? "Contribution guildelines" : "No contribution guidelines"}
					url={contributing?.html_url}
				/>
				<HealthSectionItem
					text={issue ? "Issue template" : "No issue template"}
					url={issue?.html_url}
				/>
				<HealthSectionItem
					text={pr ? "Pull request template" : "No pull request template"}
					url={pr?.html_url}
				/>
			</ul>
		</Section>
	);
};
