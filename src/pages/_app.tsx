import { DefaultAppShell } from "@/components/DefaultAppShell";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { ToastsList } from "@/components/ToastsList";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { formatTitle } from "@/lib/format";
import { useTokenStore } from "@/stores/useTokenStore";
import "@/styles/globals.css";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import Head from "next/head";
import toast from "react-hot-toast";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

dayjs.extend(relativeTime);

axios.interceptors.request.use(config => {
	if (!config.url || !config.headers) return config;

	let url;
	try {
		url = new URL(config.url);
	} catch (e) {
		return config;
	}

	if (url.hostname === "api.github.com") {
		const { token } = useTokenStore.getState();
		if (token) {
			config.headers["Authorization"] = `token ${token}`;
		}
	}

	return config;
});

function handleGitHubError(error: AxiosError) {
	if (error.response?.status === 403) {
		const limit = parseInt(
			error.response.headers["x-ratelimit-remaining"],
			10
		);
		const reset =
			parseInt(error.response.headers["x-ratelimit-reset"], 10) * 1000;
		// show erorr toast when GitHub API limit is reached
		if (limit === 0) {
			toast.error(
				`GitHub API limit reached. Reset ${dayjs().to(reset)}.`,
				{
					duration: Infinity,
					id: "github_api-limit-reached",
				}
			);
		}
	} else if (error.response?.status === 401) {
		toast.error("Invalid GitHub API token.", {
			duration: Infinity,
			id: "github_api-token-expired",
		});
	}
}

function handleAxiosError(error: AxiosError) {
	if (!error.request?.url) {
		return;
	}

	const url = new URL(error.request.url);
	if (url.hostname === "api.github.com") {
		handleGitHubError(error);
	}
}

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
			if (axios.isAxiosError(error)) {
				handleAxiosError(error);
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
					<title>{formatTitle()}</title>
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
