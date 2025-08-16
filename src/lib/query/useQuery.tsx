import { useEffect, useRef, useState } from "hono/jsx";
import { isClient } from "../utils";

type QueryKey = (string | number | undefined | null)[];

interface QueryFnContext<TKey extends QueryKey> {
	queryKey: TKey;
	signal: AbortSignal;
}

type QueryState<TData> =
	| { status: "pending"; data: undefined }
	| { status: "success"; data: TData }
	| { status: "fetching"; data?: TData }
	| { status: "error"; data?: TData; error: unknown };

export interface UseQueryOptions<TData, TKey extends QueryKey> {
	queryKey: TKey;
	queryFn: (ctx: QueryFnContext<TKey>) => Promise<TData>;
	initialData?: TData | undefined;
	enabled?: boolean;
}

// TODO: notify on cache change (not really needed)
const cache = new Map<string, any>();

const getHash = (key: QueryKey): string => {
	// TODO: better hashing?
	return key.toString();
};

export const useQuery = <TData, TKey extends QueryKey>({
	queryKey,
	queryFn,
	initialData,
	enabled = true,
}: UseQueryOptions<TData, TKey>): QueryState<TData> => {
	const key = getHash(queryKey);
	const keyRef = useRef<string | null>(null);

	const [state, setState] = useState<QueryState<TData>>(() => {
		if (initialData !== undefined) {
			if (isClient) {
				cache.set(key, initialData);
			}

			return { status: "success", data: initialData };
		}

		return { status: "pending", data: undefined };
	});

	useEffect(() => {
		if (key === keyRef.current || !enabled) {
			return;
		}

		const cachedData = cache.get(key) as TData | undefined;
		if (cachedData !== undefined) {
			setState({ status: "success", data: cachedData });
			return;
		}

		const ac = new AbortController();

		setState(prev => ({ status: "fetching", data: prev.data }));

		queryFn({ queryKey, signal: ac.signal })
			.then(data => {
				cache.set(key, data);
				setState({ status: "success", data });
			})
			.catch(error => {
				// TODO: what to do on aborted
				if (!ac.signal.aborted) {
					setState({ status: "error", error });
				}
			});

		return () => {
			ac.abort();
		};
	}, [key, enabled]);

	return state;
};
