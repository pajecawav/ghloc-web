import { PropsWithChildren } from "hono/jsx";
import { useSSRContext } from "~/lib/context";
import { Head } from "./Head";
import { Layout } from "./Layout";
import { InlineScript } from "./InlineScript";
import { cn } from "~/lib/utils";

export const App = ({ children }: PropsWithChildren) => {
	const { theme } = useSSRContext();

	return (
		<html
			lang="en"
			class={cn(
				theme === "dark" && "dark",
				"bg-white dark:bg-neutral-900 dark:text-gray-200",
			)}
		>
			<Head />

			<body>
				<InlineScript />
				<Layout>{children}</Layout>
			</body>
		</html>
	);
};
