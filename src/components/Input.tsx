import classNames from "classnames";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
	{ className, ...props }: Props,
	ref
) {
	return (
		<input
			className={classNames(
				"px-3 py-0.5 transition-[border-color] duration-100 rounded-md !outline-none appearance-none font-sm text-normal bg-normal placeholder-text-muted",
				"border-2 border-normal focus:border-active",
				className
			)}
			size={1}
			ref={ref}
			{...props}
		/>
	);
});
