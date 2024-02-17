import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
	className?: string;
	isLoading?: boolean;
	// TODO: refactor into a separate TextSkeleton which accepts a size prop
	// with values `md`, `lg` etc
	isText?: boolean;
	children?: ReactNode | (() => ReactNode);
};

export const Skeleton = ({ className, isLoading = true, isText, children }: Props) => {
	return isLoading ? (
		<div
			className={classNames("bg-accent2 animate-pulse", isText && "scale-y-[0.7]", className)}
		/>
	) : (
		<>{typeof children === "function" ? children() : children}</>
	);
};
