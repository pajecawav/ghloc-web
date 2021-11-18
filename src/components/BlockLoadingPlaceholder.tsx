import classNames from "classnames";
import { Block } from "./Block";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

type Props = {
	className?: string;
};

export const BlockLoadingPlaceholder = ({ className }: Props) => {
	return (
		<Block className={classNames("grid place-items-center", className)}>
			<LoadingPlaceholder className="w-6 h-6" />
		</Block>
	);
};
