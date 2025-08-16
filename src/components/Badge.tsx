import { JSX } from "hono/jsx";
import { cn } from "~/lib/utils";

const modeClasses = {
	outline: "text-muted border-neutral-200",
	accent: "text-neutral-700 bg-blue-100 dark:bg-neutral-800 border-neutral-100 dark:text-neutral-200",
};

type BadgeProps = JSX.IntrinsicElements["div"] & {
	mode?: keyof typeof modeClasses;
};

export const Badge = ({ class: _class, mode = "outline", ...props }: BadgeProps) => {
	return (
		<div
			class={cn(
				"flex min-w-8 items-center rounded-full border px-2 py-0.5 text-center text-xs dark:border-neutral-700",
				_class,
				modeClasses[mode],
			)}
			{...props}
		/>
	);
};
