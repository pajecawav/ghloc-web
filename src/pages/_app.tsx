import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import "@/styles/globals.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
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
	return (
		<QueryClientProvider client={queryClient}>
			<NavigationProgressBar />
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}

export default MyApp;
