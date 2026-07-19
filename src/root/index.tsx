import { useEvent } from "@pajecawav/yamf";
import type { PropsWithChildren } from "hono/jsx";
import { Layout } from "~/components/Layout";
import { ThemeScript } from "~/components/ThemeScript";
import { Router } from "~/lib/router/Router";
import "./index.css";

export default function Root({ children }: PropsWithChildren) {
	const event = useEvent();

	return (
		<Router ssrPath={event.url.pathname} ssrSearch={event.url.search}>
			<ThemeScript />
			<Layout>{children}</Layout>
		</Router>
	);
}
