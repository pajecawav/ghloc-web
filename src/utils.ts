export function removeProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "");
}

export function isServer() {
	return typeof window === "undefined";
}

export function isClient() {
	return typeof window !== "undefined";
}

export function timeoutPromise<TData, TError>(
	promise: Promise<TData>,
	ms: number,
	error?: TError
) {
	let timeoutId: NodeJS.Timeout | undefined = undefined;

	return Promise.race([
		promise,
		new Promise((_, reject) => {
			timeoutId = setTimeout(reject, ms, error);
		}),
	]).then(value => {
		clearTimeout(timeoutId);
		return value;
	});
}
