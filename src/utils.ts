export function formatRepoSize(kb: number): string {
	return kb < 1e3 ? `${Math.floor(kb)} Kb` : `${Math.floor(kb / 1e3)} Mb`;
}

export function removeProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "");
}
