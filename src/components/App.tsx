import { PropsWithChildren } from "hono/jsx";
import { useSSRContext } from "~/lib/context";
import { Head } from "./Head";
import { Layout } from "./Layout";

export const App = ({ children }: PropsWithChildren) => {
	const { theme } = useSSRContext();

	return (
		<html lang="en" class={theme === "dark" ? "dark" : undefined}>
			<Head />

			<body>
				<Layout>{children}</Layout>
			</body>
		</html>
	);
};
