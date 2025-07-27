import { EventHandlerRequest, H3Event } from "h3";
import { html, raw } from "hono/html";
import { Child } from "hono/jsx";
import { renderToReadableStream } from "hono/jsx/streaming";
import { ServerTiming } from "tiny-server-timing";
import { getAssets, sendEarlyHints } from "./assets";
import { App } from "./components/App";
import { SSRContext, SSRContextValue } from "./lib/context";
import { DEFAULT_THEME } from "./lib/theme";
import { useManifest } from "./manifest";
import { Router } from "./lib/router/Router";

interface RenderPageOptions {
	title?: string;
	event: H3Event<EventHandlerRequest>;
}

export const renderPage = async (page: Child, { title, event }: RenderPageOptions) => {
	const timing = new ServerTiming({ autoEnd: false });
	const url = getRequestURL(event);

	const clientEntry = useRuntimeConfig(event).clientEntry;
	const manifest = await useManifest();

	if (!manifest) {
		throw new Error("Failed to retrieve manifest");
	}

	const assets = getAssets({ manifest, clientEntry });

	sendEarlyHints(event, assets);

	// TODO: cookie or ls?
	// const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

	const context: SSRContextValue = {
		url: getRequestURL(event),
		title,
		assets,
		manifest,
		timing,
		// TODO: retrieve theme from request
		theme: DEFAULT_THEME,
	};

	setHeader(event, "Content-Type", "text/html; charset=UTF-8");

	const docType = raw("<!DOCTYPE html>");

	const app = (
		<SSRContext.Provider value={context}>
			<Router ssrPath={url.pathname} ssrSearch={url.search}>
				<App>{page}</App>
			</Router>
		</SSRContext.Provider>
	);

	return renderToReadableStream(html`${docType}${app}`);
};
