import classNames from "classnames";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useRef } from "react";

type Props = ComponentPropsWithoutRef<"input"> & {
	rightIcon?: ReactNode;
};

export const Input = ({ className, rightIcon, ...props }: Props) => {
	const ref = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (props.autoFocus) {
			ref.current?.focus();
		}
	}, [props.autoFocus]);

	return (
		<div
			className={classNames(
				"flex items-center py-0.5 transition-colors duration-100 rounded-md border-2 focus-within:border-gray-600",
				className
			)}
		>
			<input
				className={classNames(
					"flex-grow px-2 font-sm text-primary-200 outline-none appearance-none"
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
			{rightIcon}
		</div>
	);
};
