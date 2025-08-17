import { createContext, useContext } from "hono/jsx";
import { ServerTiming } from "tiny-server-timing";
import { Manifest } from "vite";
import { Assets } from "~/assets";
import { PreloadEntry } from "./preload";
import { Theme } from "./theme";

export interface SSRContextValue {
	url: URL;
	meta?: {
		title?: string;
		ogImage?: string;
	};
	timing: ServerTiming;
	assets: Assets;
	preconnect: string[];
	preload?: PreloadEntry[];
	manifest: Manifest;
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
