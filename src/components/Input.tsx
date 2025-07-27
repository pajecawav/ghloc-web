import { Child, JSX } from "hono/jsx";
import { cn } from "~/lib/utils";

type InputProps = JSX.IntrinsicElements["input"] & {
	after?: Child;
};

export const Input = ({ class: _class, after, ...props }: InputProps) => {
	// return (
	// 	<input
	// 		class={cn(
	// 			"font-sm placeholder-muted appearance-none rounded-md px-3 py-0.5 transition-[border-color] duration-100 !outline-none",
	// 			"border-2 border-neutral-200 p-4 focus:border-black dark:border-neutral-700 dark:focus:border-neutral-400",
	// 			_class,
	// 		)}
	// 		size={1}
	// 		{...props}
	// 	/>
	// );

	return (
		<div
			class={cn(
				"relative flex items-center rounded-md",
				"focus-within::border-black border-2 border-neutral-200 dark:border-neutral-700 dark:focus:border-neutral-400",
				after && "pr-7",
			)}
		>
			<input
				class={cn(
					"font-sm placeholder-muted appearance-none px-3 py-0.5 transition-[border-color] duration-100 !outline-none",
					_class,
				)}
				size={1}
				{...props}
			/>
			{after && <span class="absolute right-2">{after}</span>}
		</div>
	);
};
