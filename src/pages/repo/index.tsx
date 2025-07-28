import { Island } from "~/lib/island";
import { CommitsSection } from "./components/CommitsSection";
import { HealthSection } from "./components/HealthSection";
import { InfoSection } from "./components/InfoSection";
import LocsSection from "./components/LocsSection/LocsSection.island";
import { PackageSection } from "./components/PackageSection";
import { CommonSectionProps } from "./types";

interface RepoPageProps extends CommonSectionProps {
	branch: string;
}

export const RepoPage = (props: RepoPageProps) => {
	return (
		<div class="flex flex-col gap-2">
			<InfoSection {...props} />

			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				<HealthSection {...props} />

				<PackageSection {...props} />
			</div>

			<CommitsSection {...props} />

			<Island Component={LocsSection} props={props} />
		</div>
	);
};
