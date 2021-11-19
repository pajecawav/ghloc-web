import classNames from "classnames";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export const Badge = ({ className, children, ...props }: Props) => {
	return (
		<div
			className={classNames(
				"text-gray-500 px-2 py-0.5 border rounded-full",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};
