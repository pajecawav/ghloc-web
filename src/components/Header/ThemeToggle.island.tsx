import { useCallback, useLayoutEffect, useState } from "hono/jsx";
import { HeaderItem } from "~/components/Header/HeaderItem";
import { MoonIcon } from "~/components/icons/MoonIcon";
import { SunIcon } from "~/components/icons/SunIcon";
import { DEFAULT_THEME, Theme, THEME_LS_KEY } from "~/lib/theme";

const getTheme = (): Theme => {
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

export default function ThemeToggle() {
	const [theme, setTheme] = useState(getTheme);

	const rawSetTheme = (theme: Theme) => {
		const root = document.documentElement;

		root.classList.toggle("dark", theme === Theme.DARK);

		localStorage.setItem(THEME_LS_KEY, theme);
	};

	useLayoutEffect(() => {
		rawSetTheme(theme);
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setTheme(theme => (theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
	}, []);

	return (
		<HeaderItem>
			<button
				class="h-full w-full cursor-pointer"
				title="Toggle dark mode"
				onClick={toggleTheme}
			>
				<MoonIcon class="hidden dark:block" />
				<SunIcon class="dark:hidden" />
			</button>
		</HeaderItem>
	);
}
