import { Child } from "hono/jsx";
import { cn } from "~/lib/utils";

interface BlockProps {
	class?: string;
	children?: Child;
}

export const Block = ({ class: _class, children }: BlockProps) => {
	return (
		<div class={cn("rounded-md border border-neutral-200 dark:border-neutral-700", _class)}>
			{children}
		</div>
	);
};
