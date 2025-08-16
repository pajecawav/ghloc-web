import { Child } from "hono/jsx";
import { cn } from "~/lib/utils";

interface HeadingProps {
	class?: string;
	children: Child;
}

export const Heading = ({ class: _class, children }: HeadingProps) => {
	return <h2 class={cn("mb-0.5 text-lg font-semibold", _class)}>{children}</h2>;
};
