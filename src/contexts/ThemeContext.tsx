import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

export const THEME_KEY = "ghloc.theme";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeContextValue = {
	theme?: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

export enum Theme {
	light = "light",
	dark = "dark",
}

const getTheme = (): Theme | undefined => {
	if (typeof window === "undefined") {
		return undefined;
	}

	const storedTheme = window.localStorage.getItem(THEME_KEY);
	if (typeof storedTheme === "string") {
		return storedTheme as Theme;
	}

	const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
	if (userMedia?.matches) {
		return Theme.dark;
	}

	return Theme.light;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme | undefined>(getTheme);

	const rawSetTheme = (theme: Theme) => {
		const root = document.documentElement;

		if (theme === Theme.dark) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		localStorage.setItem(THEME_KEY, theme);
	};

	useEffect(() => {
		if (theme) {
			rawSetTheme(theme);
		}
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setTheme(theme => (theme === Theme.dark ? Theme.light : Theme.dark));
	}, []);

	const contextValue = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

	return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
