import { ReactNode } from "react";
import { Header } from "./Header";

type Props = {
	children?: ReactNode;
};

export const DefaultAppShell = ({ children }: Props) => {
	return (
		<div className="max-w-3xl min-h-full flex flex-col mx-auto p-2 ">
			<Header className="w-max ml-auto mb-4" />
			{children}
		</div>
	);
};
