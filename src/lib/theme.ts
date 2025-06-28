export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export const THEME_COOKIE = "ghloc.theme";

export const getThemeColor = (theme: Theme) => (theme == "light" ? "#ffffff" : "#18181b");
