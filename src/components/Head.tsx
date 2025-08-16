import { useSSRContext } from "~/lib/context";
import { getThemeColor } from "~/lib/theme";
import { buildPageTitle } from "~/lib/title";

const DESCRIPTION = "Count lines of code in a GitHub repository.";
const DEFAULT_IMAGE = "android-chrome-512x512.png";

export const Head = () => {
	const { meta, theme, assets, preconnect, preload, url } = useSSRContext();

	const title = buildPageTitle(meta?.title);
	const image = `${url.origin}/${meta?.ogImage ?? DEFAULT_IMAGE}`;
	const canonical = url.origin + url.pathname;

	return (
		<head>
			<meta charset="UTF-8" />

			{preconnect.map(url => (
				<link rel="preconnect" href={url} />
			))}
			{preload?.map(p => (
				<link
					rel={p.rel ?? "preload"}
					href={p.href}
					as={p.as}
					crossorigin={p.crossorigin}
				/>
			))}

			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
			/>
			<meta name="application-name" content="ghloc" />
			<meta name="theme-color" content={getThemeColor(theme)} />
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="manifest" href="/manifest.webmanifest" />

			{assets.css.map(href => (
				<link rel="stylesheet" href={href} />
			))}
			<script type="module" async src={assets.script} />
			{assets.preloads.map(href => (
				<link rel="modulepreload" href={href} />
			))}

			<title>{title}</title>
			<meta name="description" content={DESCRIPTION} />

			<link rel="canonical" href={canonical} />

			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={DESCRIPTION} />
			<meta property="og:image" key="og:image" content={image} />
			<meta property="og:url" key="og:url" content={canonical} />
			<meta property="og:type" key="og:type" content="website" />

			<meta name="twitter:card" key="twitter:card" content="summary_large_image" />

			<meta
				name="google-site-verification"
				content="FnhvmqWUsfbh_7kFL_8bcS5_wOYRnaQD1dY4IB3WT7s"
			/>
			<meta name="yandex-verification" content="e046d5fbc4099ee0" />

			<link
				rel="search"
				type="application/opensearchdescription+xml"
				href="/osd.xml"
				title="ghloc"
			/>
		</head>
	);
};
