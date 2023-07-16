import classNames from "classnames";
import { ComponentProps } from "react";

const colorClassNames = {
	normal: "text-badge-normal-text bg-badge-normal-bg",
	outlined: "text-badge-outlined-text bg-badge-outlined-bg",
};

type Props = ComponentProps<"div"> & {
	color?: keyof typeof colorClassNames;
};

export const Badge = ({
	className,
	children,
	color = "normal",
	...props
}: Props) => {
	return (
		<div
			className={classNames(
				"px-2 py-0.5 border border-normal rounded-full min-w-[2rem] text-center",
				colorClassNames[color],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};
