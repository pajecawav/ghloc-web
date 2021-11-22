import { isClient } from "@/utils";
import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";

export const ThemeContext = createContext<ThemeContextValue>(
	{} as ThemeContextValue
);

export type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

export enum Theme {
	light = "light",
	dark = "dark",
}

const getTheme = (): Theme => {
	const storedTheme = isClient()
		? window.localStorage.getItem("color-theme")
		: undefined;
	if (typeof storedTheme === "string") {
		return storedTheme as Theme;
	}

	const userMedia = isClient()
		? window.matchMedia("(prefers-color-scheme: dark)")
		: undefined;
	if (userMedia?.matches) {
		return Theme.light;
	}

	return Theme.dark;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState(getTheme);

	const rawSetTheme = (theme: Theme) => {
		const root = document.documentElement;

		if (theme === Theme.dark) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		localStorage.setItem("color-theme", theme);
	};

	const toggleTheme = useCallback(() => {
		setTheme(theme => (theme === Theme.dark ? Theme.light : Theme.dark));
	}, []);

	useEffect(() => {
		rawSetTheme(theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
