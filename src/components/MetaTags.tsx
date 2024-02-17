import Head from "next/head";

const DEFAULT_ORIGIN = "https://ghloc.vercel.app";
const DEFAULT_DESCRIPTION = "Count lines of code in a GitHub repository.";

interface MetaTagsProps {
	title: string;
	description?: string;
	path: string;
	image?: string;
}

export function MetaTags({ title, description, image, path }: MetaTagsProps) {
	const origin = typeof window === "undefined" ? DEFAULT_ORIGIN : window.location.origin;
	const defaultImage = `${origin}/android-chrome-512x512.png`;

	return (
		<Head>
			<title>{title}</title>
			<meta
				name="description"
				key="description"
				content={description ?? DEFAULT_DESCRIPTION}
			/>

			<link rel="canonical" href={origin + path} />

			<meta property="og:type" key="og:type" content="website" />
			<meta property="og:title" key="og:title" content={title} />
			<meta
				property="og:description"
				key="og:description"
				content={description ?? DEFAULT_DESCRIPTION}
			/>
			<meta
				property="og:image"
				key="og:image"
				content={image ? `${origin}/${image}` : defaultImage}
			/>
			<meta property="og:url" key="og:url" content={origin + path} />
			<meta property="og:type" key="og:type" content="website" />

			<meta
				name="twitter:card"
				key="twitter:card"
				content={image ? "summary_large_image" : "summary"}
			/>
		</Head>
	);
}
