export function formatBytes(bytes: number, precision: number = 1): string {
	let suffix = "MB";
	for (const suff of ["B", "KB"]) {
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

	const bytesStr = bytes.toFixed(precision);

	return `${formatNumber(parseFloat(bytesStr))} ${suffix}`;
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
	const str = value.toFixed(precision).replace(/\.0+/, "");

	return `${str}${suffix}`;
}

export function formatNumber(value: number): string {
	return new Intl.NumberFormat().format(value);
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

export function formatMonth(date: Date): string {
	return MONTH_FORMATTER.format(date);
}

export function formatDate(date: Date): string {
	return DATE_FORMATTER.format(date);
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export function formatRelativeTime(target: number, from: number = Date.now()): string {
	const diff = target - from;
	const absDiff = Math.abs(diff);

	let value: number;
	let unit: Intl.RelativeTimeFormatUnit;

	if (absDiff < MINUTE) {
		value = Math.round(diff / 1000);
		unit = "second";
	} else if (absDiff < HOUR) {
		value = Math.round(diff / MINUTE);
		unit = "minute";
	} else if (absDiff < DAY) {
		value = Math.round(diff / HOUR);
		unit = "hour";
	} else if (absDiff < WEEK) {
		value = Math.round(diff / DAY);
		unit = "day";
	} else if (absDiff < MONTH) {
		value = Math.round(diff / WEEK);
		unit = "week";
	} else if (absDiff < YEAR) {
		value = Math.round(diff / MONTH);
		unit = "month";
	} else {
		value = Math.round(diff / YEAR);
		unit = "year";
	}

	return relativeTimeFormatter.format(value, unit);
}
