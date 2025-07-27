import { JSX } from "hono/jsx";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { cn } from "~/lib/utils";

export type SelectProps = JSX.IntrinsicElements["select"];

export function Select({ class: _class, ...props }: SelectProps) {
	return (
		<div class="relative w-max">
			<select
				class={cn(
					"font-sm appearance-none rounded-md border bg-transparent py-0.5 pr-8 pl-3 !outline-none",
					"border-2 border-neutral-200 focus:border-black dark:border-neutral-700 dark:focus:border-neutral-400",
					_class,
				)}
				{...props}
			/>
			<div
				class="pointer-events-none absolute top-0 right-3 bottom-0 grid place-items-center"
				aria-hidden="true"
			>
				<ChevronDownIcon class="text-muted h-4 w-4 transition-transform duration-300" />
			</div>
		</div>
	);
}
