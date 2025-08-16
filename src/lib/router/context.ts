import { createContext } from "hono/jsx";

export interface RouterContextValue {
	ssrPath: string;
	ssrSearch: string;
}

export const RouterContext = createContext<RouterContextValue | null>(null);
