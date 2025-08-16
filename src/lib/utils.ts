export const isServer = typeof window === "undefined";
export const isClient = !isServer;

export const cn = (...values: unknown[]): string => {
	return values.filter(value => typeof value === "string" && value).join(" ");
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const ensureLeadingSlash = (path: string) => (path[0] === "/" ? path : `/${path}`);

export const removeLeadingSlash = (path: string) => (path[0] === "/" ? path.slice(1) : path);

export const removeProtocol = (url: string): string => {
	return url.replace(/^https?:\/\//, "");
};
