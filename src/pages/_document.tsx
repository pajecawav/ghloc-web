import { ThemeScript } from "@/ThemeScript";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
						rel="stylesheet"
					/>
					<link rel="preconnect" href="https://api.github.com" />

					<link rel="icon" href="/favicon.ico" sizes="any" />
					<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/apple-touch-icon.png"
					/>
					<meta name="application-name" content="ghloc" />
					<link rel="manifest" href="/manifest.json" />

					<meta
						name="google-site-verification"
						content="FnhvmqWUsfbh_7kFL_8bcS5_wOYRnaQD1dY4IB3WT7s"
					/>
					<meta
						name="yandex-verification"
						content="e046d5fbc4099ee0"
					/>

					<link
						rel="search"
						type="application/opensearchdescription+xml"
						href="/osd.xml"
						title="ghloc"
					/>
				</Head>
				<body className="text-normal bg-normal">
					{/* insert blocking script to detect color scheme before rendering the app */}
					<ThemeScript />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
