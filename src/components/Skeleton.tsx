import { JSX } from "hono/jsx/jsx-runtime";
import { cn } from "~/lib/utils";

export const Skeleton = ({ class: _class, children, ...props }: JSX.IntrinsicElements["div"]) => {
	return (
		<div
			class={cn("animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700", _class)}
			{...props}
		>
			{children || <>&zwnj;</>}
		</div>
	);
};
