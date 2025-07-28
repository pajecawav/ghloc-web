import { createContext, useContext } from "hono/jsx";
import { Manifest } from "vite";
import { Assets } from "~/assets";
import { Theme } from "./theme";
import { ServerTiming } from "tiny-server-timing";

export interface SSRContextValue {
	url: URL;
	title?: string;
	assets: Assets;
	preconnect: string[];
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
