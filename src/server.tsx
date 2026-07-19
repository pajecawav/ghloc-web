import { defineServerEntry } from "@pajecawav/yamf/server";
import { DEFAULT_THEME, getThemeColor } from "~/lib/theme";
import { buildPageTitle } from "~/lib/title";

const DESCRIPTION = "Count lines of code in a GitHub repository.";
const DEFAULT_IMAGE = "android-chrome-512x512.png";

export default defineServerEntry({
	head: event => {
		const url = event.url;
		const image = `${url.origin}/${DEFAULT_IMAGE}`;
		const canonical = url.origin + url.pathname;
		const title = buildPageTitle();

		return {
			htmlAttrs: {
				lang: "en",
				class: "bg-white dark:bg-neutral-900 dark:text-gray-200",
			},
			title,
			meta: [
				{ charset: "UTF-8" },
				{
					name: "viewport",
					content:
						"width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0",
				},
				{ name: "application-name", content: "ghloc" },
				{ name: "theme-color", content: getThemeColor(DEFAULT_THEME) },
				{ name: "description", content: DESCRIPTION },
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: title },
				{ property: "og:description", content: DESCRIPTION },
				{ property: "og:image", content: image },
				{ property: "og:url", content: canonical },
				{ name: "twitter:card", content: "summary_large_image" },
				{
					name: "google-site-verification",
					content: "FnhvmqWUsfbh_7kFL_8bcS5_wOYRnaQD1dY4IB3WT7s",
				},
				{ name: "yandex-verification", content: "e046d5fbc4099ee0" },
			],
			link: [
				{ rel: "preconnect", href: "https://api.github.com" },
				{ rel: "preconnect", href: "https://ghloc.ifels.dev" },
				{ rel: "icon", href: "/favicon.ico", sizes: "any" },
				{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				},
				{ rel: "manifest", href: "/manifest.json" },
				{ rel: "canonical", href: canonical },
				{
					rel: "search",
					type: "application/opensearchdescription+xml",
					href: "/osd.xml",
					title: "ghloc",
				},
			],
		};
	},
});

if (import.meta.hot) {
	import.meta.hot.accept();
}
