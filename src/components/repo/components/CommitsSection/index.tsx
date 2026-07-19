import { useEvent } from "@pajecawav/yamf";
import { withServerTiming } from "nitro/h3";
import { ghApi } from "~/lib/github/api";
import type { CommonSectionProps } from "../../types";
import CommitsSectionContent from "./CommitsSectionContent.island";

type CommitsSectionProps = CommonSectionProps;

export const CommitsSection = async ({ owner, repo, ...rest }: CommitsSectionProps) => {
	const event = useEvent();

	let activity;
	try {
		activity = await withServerTiming(event, "activity", () =>
			ghApi.getCommitActivity(owner, repo),
		);
	} catch (error) {
		console.error(error);
	}

	return <CommitsSectionContent owner={owner} repo={repo} activity={activity} {...rest} />;
};
