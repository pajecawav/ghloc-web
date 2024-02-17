export function removeProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "");
}

export function isServer() {
	return typeof window === "undefined";
}

export function isClient() {
	return typeof window !== "undefined";
}

export function timeoutPromise<TData>(promise: Promise<TData>, ms: number): Promise<TData> {
	let timeoutId: NodeJS.Timeout | undefined = undefined;

	return Promise.race([
		promise,
		new Promise<never>((_, reject) => {
			timeoutId = setTimeout(reject, ms, new Error("Promise timeout"));
		}),
	]).then(value => {
		clearTimeout(timeoutId);
		return value;
	});
}
