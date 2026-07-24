import { defineCachedFunction } from "ocache";

export const cachedApiFunction = <TArgs extends unknown[], TResult>(
	name: string,
	fn: (...args: TArgs) => Promise<TResult>,
) => {
	if (import.meta.env.SSR) {
		return defineCachedFunction(fn, { name, maxAge: 5 * 60, swr: false });
	}

	return fn;
};
