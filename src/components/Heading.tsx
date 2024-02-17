import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
	className?: string;
	children: ReactNode;
};

export const Heading = ({ className, children }: Props) => {
	return <h2 className={classNames("text-lg font-semibold", className)}>{children}</h2>;
};
