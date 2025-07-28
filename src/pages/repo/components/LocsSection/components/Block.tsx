import { Child } from "hono/jsx";
import { cn } from "~/lib/utils";

interface BlockProps {
	class?: string;
	children?: Child;
}

export const Block = ({ class: _class, children }: BlockProps) => {
	return <div class={cn("border-border rounded-md border", _class)}>{children}</div>;
};
