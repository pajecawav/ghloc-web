import { useSSRContext } from "~/lib/context";
import { getThemeColor } from "~/lib/theme";
import { buildPageTitle } from "~/lib/title";

export const Head = () => {
	const { title, theme, assets } = useSSRContext();

	return (
		<head>
			<meta charset="UTF-8" />

			<link rel="preconnect" href="https://api.github.com" />

			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
			/>
			<meta name="application-name" content="ghloc" />
			<meta name="theme-color" content={getThemeColor(theme)} />
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="manifest" href="/manifest.webmanifest" />

			<title>{buildPageTitle(title)}</title>

			{assets.css.map(href => (
				<link rel="stylesheet" href={href} />
			))}

			<script type="module" async src={assets.script} />

			{assets.preloads.map(href => (
				<link rel="modulepreload" href={href} />
			))}

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
