import classNames from "classnames";
import styles from "./Skeleton.module.css";

type Props = {
	className?: string;
};

export const Skeleton = ({ className }: Props) => {
	return <div className={classNames(styles.skeleton, className)} />;
};
