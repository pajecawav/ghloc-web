import type { PropsWithChildren } from "hono/jsx";
import { Layout } from "~/components/Layout";
import { ThemeScript } from "~/components/ThemeScript";
import "./index.css";

export default function Root({ children }: PropsWithChildren) {
	return (
		<>
			<ThemeScript />
			<Layout>{children}</Layout>
		</>
	);
}
