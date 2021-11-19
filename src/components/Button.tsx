import classNames from "classnames";
import React, { ComponentProps } from "react";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

const colorClassnames = {
	default:
		"text-gray-300 bg-black disabled:bg-opacity-50 hover:bg-opacity-75 active:bg-opacity-50",
	outlined:
		"border border-black bg-white hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-200",
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
				"relative px-6 py-1 transition-all duration-100 rounded-md disabled:cursor-auto",
				colorClassnames[color],
				className
			)}
			{...props}
		>
			{children}
			{isProcessing && (
				<div
					className={classNames(
						"absolute inset-0 grid place-items-center rounded-md",
						colorClassnames[color]
					)}
				>
					<LoadingPlaceholder className="w-5 h-5" />
				</div>
			)}
		</button>
	);
};
