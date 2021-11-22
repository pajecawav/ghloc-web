import { DefaultAppShell } from "@/components/DefaultAppShell";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { ToastsList } from "@/components/ToastsList";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/styles/globals.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

dayjs.extend(relativeTime);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 min
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	const AppShell = (Component as any).AppShell || DefaultAppShell;

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Head>
					<title>Github Stats</title>
				</Head>

				<NavigationProgressBar />
				<ToastsList />

				<AppShell>
					<Component {...pageProps} />
				</AppShell>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
