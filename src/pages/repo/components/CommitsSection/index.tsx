import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { useSSRContext } from "~/lib/context";
import { ghApi } from "~/lib/github/api";
import { Island } from "~/lib/island";
import { CommonSectionProps } from "../../types";
import { Section } from "../Section";
import CommitsSectionContent from "./CommitsSectionContent.island.lazy";

type CommitsSectionProps = CommonSectionProps;

export const CommitsSection = async ({ owner, repo, ...rest }: CommitsSectionProps) => {
	const { timing } = useSSRContext();

	let activity;
	try {
		activity = await timing.timeAsync("activity", () => ghApi.getCommitActivity(owner, repo));
	} catch (error) {
		console.error(error);

		return (
			<Section title="Commits">
				<ErrorPlaceholder>Failed to load commit activity</ErrorPlaceholder>
			</Section>
		);
	}

	if (activity) {
		return <CommitsSectionContent owner={owner} repo={repo} activity={activity} {...rest} />;
	}

	return (
		<Island
			Component={CommitsSectionContent}
			props={{ owner, repo, activity: undefined, ...rest }}
		/>
	);
};
