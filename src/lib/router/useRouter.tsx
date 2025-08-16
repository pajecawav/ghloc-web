import { useContext, useSyncExternalStore } from "hono/jsx";
import { RouterContext } from "./context";

// adapted from https://github.com/molefrog/wouter/blob/b32804fa35aedff1e9bd3da98ae82c5af5c71a61/packages/wouter/src/use-browser-location.js#L38

interface NavigateOptions {
	replace?: boolean;
}

const events = ["popstate", "hashchange"];

const listeners = new Set<VoidFunction>();

const subscribe = (cb: VoidFunction) => {
	listeners.add(cb);
	for (const event of events) {
		addEventListener(event, cb);
	}

	return () => {
		listeners.delete(cb);
		for (const event of events) {
			removeEventListener(event, cb);
		}
	};
};

const notify = () => {
	for (const cb of listeners) {
		cb();
	}
};

const getPathname = () => location.pathname;

const getSearch = () => new URLSearchParams(location.search);

export const useRouter = () => {
	const ctx = useContext(RouterContext);

	const _pathname = useSyncExternalStore(
		subscribe,
		getPathname,
		ctx?.ssrPath !== undefined ? () => ctx?.ssrPath ?? "" : getPathname,
	);

	const _search = useSyncExternalStore(
		subscribe,
		getSearch,
		ctx?.ssrSearch !== undefined ? () => new URLSearchParams(ctx?.ssrSearch ?? "") : getSearch,
	);

	const navigate = (pathname: string, search: URLSearchParams, options?: NavigateOptions) => {
		const args = [null, "", search.size ? `${pathname}?${search}` : pathname] as const;

		if (options?.replace) {
			history.replaceState(...args);
		} else {
			history.pushState(...args);
		}

		notify();
	};

	const setSearch = (
		search: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
		options?: NavigateOptions,
	) => {
		if (typeof search === "function") {
			search = search(_search);
		}

		navigate(_pathname, search, options);
	};

	return { pathname: _pathname, search: _search, setSearch };
};
