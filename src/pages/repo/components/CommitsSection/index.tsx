import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { ghApi } from "~/lib/github/api";
import { Island } from "~/lib/island";
import { CommonSectionProps } from "../../types";
import { Section } from "../Section";
import CommitsSectionContent from "./CommitsSectionContent.island";

type CommitsSectionProps = CommonSectionProps;

export const CommitsSection = async ({ owner, repo }: CommitsSectionProps) => {
	let activity;
	try {
		activity = await ghApi.getCommitActivity(owner, repo);
	} catch (error) {
		console.error(error);

		return (
			<Section title="Commits">
				<ErrorPlaceholder>Failed to load commit activity</ErrorPlaceholder>
			</Section>
		);
	}

	if (activity) {
		return <CommitsSectionContent owner={owner} repo={repo} activity={activity} />;
	}

	return (
		<Island Component={CommitsSectionContent} props={{ owner, repo, activity: undefined }} />
	);
};
