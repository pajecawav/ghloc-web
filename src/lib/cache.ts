import { isServer } from "./utils";

export const cachedApiFunction = <TArgs extends unknown[], TResult>(
	name: string,
	fn: (...args: TArgs) => Promise<TResult>,
) => {
	if (isServer) {
		return defineCachedFunction(fn, { name, maxAge: 5 * 60, swr: false });
	}

	return fn;
};
