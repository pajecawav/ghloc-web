import { useCallback, useLayoutEffect, useState } from "hono/jsx";
import { HeaderItem } from "~/components/Header/HeaderItem";
import { MoonIcon } from "~/components/icons/MoonIcon";
import { SunIcon } from "~/components/icons/SunIcon";
import { getTheme, setTheme as rawSetTheme, Theme } from "~/lib/theme";

export default function ThemeToggle() {
	const [theme, setTheme] = useState(getTheme);

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
