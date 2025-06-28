export const cn = (...values: unknown[]): string => {
	return values.filter(value => typeof value === "string" && value).join(" ");
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const ensureLeadingSlash = (path: string) => (path[0] === "/" ? path : `/${path}`);
