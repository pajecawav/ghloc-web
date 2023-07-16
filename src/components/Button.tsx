import classNames from "classnames";
import React, { ComponentProps } from "react";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

const colorClassnames = {
	default: "bg-btn-normal-bg text-btn-normal-text border border-normal",
};

type Props = ComponentProps<"button"> & {
	isProcessing?: boolean;
	color?: keyof typeof colorClassnames;
};

export const Button = ({
	className,
	isProcessing,
	color = "default",
	children,
	...props
}: Props) => {
	return (
		<button
			className={classNames(
				"relative px-6 py-1 transition-all duration-100 rounded-md outline-none disabled:cursor-auto",
				colorClassnames[color],
				className,
			)}
			{...props}
		>
			{children}
			{isProcessing && (
				<div
					className={classNames(
						"absolute inset-0 grid place-items-center rounded-md text-subtle",
						colorClassnames[color],
					)}
				>
					<LoadingPlaceholder className="w-5 h-5" />
				</div>
			)}
		</button>
	);
};
