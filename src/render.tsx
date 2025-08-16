import { EventHandlerRequest, H3Event } from "h3";
import { html, raw } from "hono/html";
import { Child } from "hono/jsx";
import { renderToReadableStream } from "hono/jsx/streaming";
import { getAssets } from "./assets";
import { App } from "./components/App";
import { SSRContext, SSRContextValue } from "./lib/context";
import { IslandFC } from "./lib/island/types";
import { dedupePreload, getPreloadForModule, PreloadEntry } from "./lib/preload";
import { Router } from "./lib/router/Router";
import { DEFAULT_THEME } from "./lib/theme";
import { useManifest } from "./manifest";

interface RenderPageOptions {
	title?: string;
	event: H3Event<EventHandlerRequest>;
	ogImage?: string;
	preload?: PreloadEntry[];
	preloadIslands?: IslandFC[];
}

export const renderPage = async (
	page: Child,
	{ title, event, ogImage, preload = [], preloadIslands }: RenderPageOptions,
) => {
	const url = getRequestURL(event);

	const clientEntry = useRuntimeConfig(event).clientEntry;
	const manifest = await useManifest();

	if (!manifest) {
		throw new Error("Failed to retrieve manifest");
	}

	const assets = getAssets({ manifest, clientEntry });
	const preconnect = ["https://api.github.com", "https://ghloc.ifels.dev"];

	if (preloadIslands) {
		const islandPreloads = preloadIslands
			.map(island => island.src && getPreloadForModule(island.src, manifest))
			.filter(v => !!v);

		preload = dedupePreload([...preload, ...islandPreloads].flat());
	}

	// TODO: cookie or ls?
	// const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

	const context: SSRContextValue = {
		url: getRequestURL(event),
		meta: {
			title,
			ogImage,
		},
		assets,
		preconnect,
		preload,
		manifest,
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
