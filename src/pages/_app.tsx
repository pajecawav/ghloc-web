import { DefaultAppShell } from "@/components/DefaultAppShell";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { ToastsList } from "@/components/ToastsList";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/styles/globals.css";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import toast from "react-hot-toast";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

dayjs.extend(relativeTime);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 min
		},
	},
	queryCache: new QueryCache({
		onError: error => {
			// show erorr toast when GitHub API limit is reached
			if (axios.isAxiosError(error) && error.response?.status === 403) {
				const limit = parseInt(
					error.response.headers["x-ratelimit-remaining"]
				);
				const reset =
					parseInt(error.response.headers["x-ratelimit-reset"]) *
					1000;
				if (limit === 0) {
					toast.error(
						`GitHub API limit reached. Reset ${dayjs().to(reset)}.`,
						{
							duration: Infinity,
							id: "github_api-limit-reached",
						}
					);
				}
			}
		},
	}),
});

function MyApp({ Component, pageProps }: AppProps) {
	const AppShell = (Component as any).AppShell || DefaultAppShell;

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Head>
					<title>GitHub Stats</title>
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
