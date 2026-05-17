import { JSX } from "hono/jsx";
import { cn } from "~/lib/utils";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";

export type SelectProps = JSX.IntrinsicElements["select"];

export function Select({ class: _class, ...props }: SelectProps) {
	return (
		<div class="relative w-max">
			<select
				class={cn(
					"font-sm appearance-none rounded-md border bg-transparent py-0.5 pr-8 pl-3 transition-colors duration-100 !outline-none",
					"border-2 border-border focus-within:border-border-focus",
					_class,
				)}
				{...props}
			/>
			<div
				class="pointer-events-none absolute top-0 right-3 bottom-0 grid place-items-center"
				aria-hidden="true"
			>
				<ChevronDownIcon class="h-4 w-4 text-muted transition-transform duration-300" />
			</div>
		</div>
	);
}
