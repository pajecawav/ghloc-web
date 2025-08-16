import { Child } from "hono/jsx";
import { Heading } from "~/components/Heading";

interface SectionProps {
	title: string;
	children: Child;
}

export const Section = ({ title, children }: SectionProps) => {
	return (
		<section>
			<Heading>{title}</Heading>
			{children}
		</section>
	);
};
