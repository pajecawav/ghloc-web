export function formatTitle(text?: string): string {
	return (text ? `${text} | ` : "") + "ghloc";
}

export function formatRepoSize(kb: number): string {
	return kb < 1e3 ? `${Math.floor(kb)} KB` : `${Math.floor(kb / 1e3)} MB`;
}

export function formatSize(bytes: number, precision: number = 1): string {
	let suffix = "GB";
	for (const suff of ["B", "KB", "MB"]) {
		if (bytes < 1024) {
			suffix = suff;
			break;
		} else {
			bytes /= 1024;
		}
	}

	if (bytes > 10) {
		bytes = Math.floor(bytes);
	}

	let bytesStr = bytes.toFixed(precision);

	return `${parseFloat(bytesStr)} ${suffix}`;
}

export function formatRepoStat(stat: number): string {
	const str = stat < 1000 ? stat.toString() : `${(stat / 1000).toFixed(1)}k`;
	return str.replace(".0", "");
}

export function formatNumber(value: number): string {
	return new Intl.NumberFormat().format(value);
}

export function humanize(value: number): string {
	let suffix = "";
	for (const suff of ["", "k", "M"]) {
		if (value < 1000) {
			suffix = suff;
			break;
		} else {
			value /= 1000;
		}
	}

	const precision = value < 50 ? 1 : 0;
	let str = value.toFixed(precision).replace(/\.0+/, "");

	return `${str}${suffix}`;
}
