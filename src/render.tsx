import { EventHandlerRequest, H3Event } from "h3";
import { html, raw } from "hono/html";
import { Child } from "hono/jsx";
import { renderToReadableStream } from "hono/jsx/streaming";
import { getAssets } from "./assets";
import { App } from "./components/App";
import { SSRContext, SSRContextValue } from "./lib/context";
import { DEFAULT_THEME, Theme, THEME_COOKIE } from "./lib/theme";
import { useManifest } from "./manifest";

interface RenderPageOptions {
	title?: string;
	event: H3Event<EventHandlerRequest>;
}

export const renderPage = async (page: Child, { title, event }: RenderPageOptions) => {
	const clientEntry = useRuntimeConfig(event).clientEntry;
	const manifest = await useManifest();

	const assets = getAssets({ manifest, clientEntry });

	const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

	const context: SSRContextValue = {
		url: getRequestURL(event),
		title,
		assets,
		manifest,
		theme,
	};

	setHeader(event, "Content-Type", "text/html; charset=UTF-8");

	const docType = raw("<!DOCTYPE html>");

	const app = (
		<SSRContext.Provider value={context}>
			<App>{page}</App>
		</SSRContext.Provider>
	);

	return renderToReadableStream(html`${docType}${app}`);
};
