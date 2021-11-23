import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Skeleton.module.css";

type Props = {
	className?: string;
	isLoading?: boolean;
	children?: ReactNode | (() => ReactNode);
};

export const Skeleton = ({ className, isLoading = true, children }: Props) => {
	return isLoading ? (
		<div className={classNames(styles.skeleton, className)} />
	) : (
		<>{typeof children === "function" ? children() : children}</>
	);
};
