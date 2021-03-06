import { ThemeScript } from "@/ThemeScript";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
						rel="stylesheet"
					/>
					<meta
						name="description"
						content="See GitHub repository commit activity and total lines of code by language."
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
