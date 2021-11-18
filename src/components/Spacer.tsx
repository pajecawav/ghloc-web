import classNames from "classnames";
import { ComponentProps } from "react";

type Props = {
	className?: string;
};

export const Spacer = ({ className }: Props) => (
	<div className={classNames("flex-grow", className)} />
);
