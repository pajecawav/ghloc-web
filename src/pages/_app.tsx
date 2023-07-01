import { DefaultAppShell } from "@/components/DefaultAppShell";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { ToastsList } from "@/components/ToastsList";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/styles/globals.css";
import {
	Hydrate,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import Head from "next/head";

dayjs.extend(relativeTime);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	const AppShell = (Component as any).AppShell || DefaultAppShell;

	return (
		<QueryClientProvider client={queryClient}>
			<Analytics />
			<Hydrate state={pageProps.dehydratedState}>
				<ThemeProvider>
					<Head>
						<title>ghloc | Count lines of code</title>
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
						/>
					</Head>

					<NavigationProgressBar />
					<ToastsList />

					<AppShell>
						<Component {...pageProps} />
					</AppShell>
				</ThemeProvider>
			</Hydrate>
		</QueryClientProvider>
	);
}

export default MyApp;
