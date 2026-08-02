export const enum Theme {
	LIGHT = "light",
	DARK = "dark",
}

export const DEFAULT_THEME = Theme.LIGHT;

export const THEME_LS_KEY = "ghloc.theme";

export const getThemeColor = (theme: Theme) => (theme == Theme.LIGHT ? "#ffffff" : "#18181b");

export const getTheme = (): Theme => {
	if (typeof window === "undefined") {
		return DEFAULT_THEME;
	}

	const storedTheme = window.localStorage.getItem(THEME_LS_KEY);
	if (typeof storedTheme === "string") {
		return storedTheme as Theme;
	}

	const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
	if (userMedia?.matches) {
		return Theme.DARK;
	}

	return Theme.LIGHT;
};

export const setTheme = (theme: Theme) => {
	const root = document.documentElement;

	root.dataset.theme = theme;

	localStorage.setItem(THEME_LS_KEY, theme);
};
