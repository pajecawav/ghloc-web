import { createContext, JSX, useContext } from "hono/jsx";
import { ServerTiming } from "tiny-server-timing";
import { Manifest } from "vite";
import { Assets } from "~/assets";
import { Theme } from "./theme";

export interface PreloadEntry {
	href: string;
	as: string;
	crossorigin?: JSX.CrossOrigin;
}

export interface SSRContextValue {
	url: URL;
	title?: string;
	assets: Assets;
	preconnect: string[];
	preload?: PreloadEntry[];
	manifest: Manifest;
	timing: ServerTiming;
	ogImage?: string;
	theme: Theme;
}

export const SSRContext = createContext<SSRContextValue | null>(null);

export const useSSRContext = () => {
	const ctx = useContext(SSRContext);

	if (!ctx) {
		throw new Error("SSRContext is null");
	}

	return ctx;
};
