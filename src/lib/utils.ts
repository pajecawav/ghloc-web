export const isServer = import.meta.env.SSR;
export const isClient = !import.meta.env.SSR;

export const cn = (...values: unknown[]): string => {
	return values.filter(value => typeof value === "string" && value).join(" ");
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const removeProtocol = (url: string): string => {
	return url.replace(/^https?:\/\//, "");
};
