export const enum Theme {
	LIGHT = "light",
	DARK = "dark",
}

export const DEFAULT_THEME = Theme.LIGHT;

export const THEME_LS_KEY = "ghloc.theme";

export const getThemeColor = (theme: Theme) => (theme == Theme.LIGHT ? "#ffffff" : "#18181b");
