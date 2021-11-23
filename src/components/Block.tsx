import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
	className?: string;
	children?: ReactNode;
};

export const Block = ({ className, children }: Props) => {
	return (
		<div
			className={classNames(
				"border border-normal-border rounded-lg",
				className
			)}
		>
			{children}
		</div>
	);
};
