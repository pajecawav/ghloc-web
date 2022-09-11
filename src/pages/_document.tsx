import { ThemeScript } from "@/ThemeScript";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
					<meta name="application-name" content="ghloc" />
					<meta
						name="description"
						content="Count lines of code in a GitHub repository"
					/>
					<meta
						name="google-site-verification"
						content="FnhvmqWUsfbh_7kFL_8bcS5_wOYRnaQD1dY4IB3WT7s"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
						rel="stylesheet"
					/>
					<link rel="preconnect" href="https://api.github.com" />
					{process.env.NEXT_PUBLIC_UMAMI_SCRIPT_SRC && (
						<script
							async
							defer
							data-website-id={
								process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
							}
							src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_SRC}
						/>
					)}
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
