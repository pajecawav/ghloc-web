import { Child } from "hono/jsx";
import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { Section } from "../Section";

interface PackageSectionFallbackProps {
	children?: Child;
}

export const PackageSectionFallback = ({ children }: PackageSectionFallbackProps) => {
	return (
		<Section title="Package">
			<ErrorPlaceholder>{children || "Failed to load package info"}</ErrorPlaceholder>
		</Section>
	);
};
