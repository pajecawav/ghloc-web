export function formatRepoSize(kb: number): string {
	return kb < 1e3 ? `${Math.floor(kb)} Kb` : `${Math.floor(kb / 1e3)} Mb`;
}

export function formatRepoStat(stat: number): string {
	const str = stat < 1000 ? stat.toString() : `${(stat / 1000).toFixed(1)}k`;
	return str.replace(".0", "");
}

export function removeProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "");
}

export function isServer() {
	return typeof window === "undefined";
}

export function isClient() {
	return typeof window !== "undefined";
}
