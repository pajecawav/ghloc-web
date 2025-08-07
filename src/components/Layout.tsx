import { PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";
import { Island } from "~/lib/island";
import Toaster from "./Toaster.island";

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<main class="mx-auto flex min-h-full max-w-3xl flex-col p-2">
			<Header />

			{children}

			<Island Component={Toaster} props={{}} />
		</main>
	);
};
