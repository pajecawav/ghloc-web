import { PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";
import { Island } from "~/lib/island";
import Toaster from "./Toaster.island";
import RecentRepos from "~/components/RecentRepos.island";

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<div class="fixed top-24 right-4 z-50 hidden lg:block">
				<Island Component={RecentRepos} props={{}} />
			</div>

			<main class="mx-auto flex min-h-full max-w-3xl flex-col p-2">
				<Header />

				{children}

				<Island Component={Toaster} props={{}} />
			</main>
		</>
	);
};
