import classNames from "classnames";
import { ComponentProps } from "react";

type Props = ComponentProps<"input">;

export const Input = ({ className, ...props }: Props) => {
	return (
		<input
			className={classNames(
				"px-1 py-0.5 transition-colors duration-100 rounded-md outline-none appearance-none font-sm text-primary-200",
				"border-2 focus:border-gray-600",
				className
			)}
			size={1}
			{...props}
		/>
	);
};
