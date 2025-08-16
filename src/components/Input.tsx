import { Child, JSX } from "hono/jsx";
import { cn } from "~/lib/utils";

type InputProps = JSX.IntrinsicElements["input"] & {
	after?: Child;
	inputClass?: string;
};

export const Input = ({ class: _class, inputClass, after, ...props }: InputProps) => {
	return (
		<div
			class={cn(
				"relative flex items-center rounded-md transition-colors duration-100",
				"border-border focus-within:border-border-focus border-2",
				after && "pr-7",
				_class,
			)}
		>
			<input
				class={cn(
					"font-sm placeholder-muted w-full appearance-none px-3 py-0.5 !outline-none",
					inputClass,
				)}
				size={1}
				{...props}
			/>
			{after && <span class="absolute right-2">{after}</span>}
		</div>
	);
};
