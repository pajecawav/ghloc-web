import { PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<main className="max-w-3xl min-h-full flex flex-col mx-auto p-2">
			<Header />
			{children}
		</main>
	);
};
