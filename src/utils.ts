export function formatRepoSize(kb: number) {
	return kb < 1e3 ? `${Math.floor(kb)} Kb` : `${Math.floor(kb / 1e3)} Mb`;
}
