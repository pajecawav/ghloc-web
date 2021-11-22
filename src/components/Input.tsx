import classNames from "classnames";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

type Props = ComponentPropsWithoutRef<"input">;

export const Input = ({ className, ...props }: Props) => {
	const ref = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (props.autoFocus) {
			ref.current?.focus();
		}
	}, [props.autoFocus]);

	return (
		<input
			className={classNames(
				"px-3 py-0.5 transition-colors duration-100 rounded-md !outline-none appearance-none font-sm text-primary-200",
				"border-2 focus:border-gray-600",
				className
			)}
			size={1}
			ref={ref}
			{...(props.autoFocus && {
				// HACK: trick to always place caret at the end of the text
				onFocus: e =>
					e.currentTarget.setSelectionRange(
						e.currentTarget.value.length,
						e.currentTarget.value.length
					),
			})}
			{...props}
		/>
	);
};
