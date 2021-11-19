import classNames from "classnames";

type Props = {
	className?: string;
};

export const Spacer = ({ className }: Props) => (
	<div className={classNames("flex-grow", className)} />
);
