export function removeProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "");
}

export function isServer() {
	return typeof window === "undefined";
}

export function isClient() {
	return typeof window !== "undefined";
}
