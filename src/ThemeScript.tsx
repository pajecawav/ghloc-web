import { Theme, THEME_KEY } from "./contexts/ThemeContext";

export const ThemeScript = () => {
	const script = `
    (function() {
        function getTheme() {
            const storedTheme = window.localStorage.getItem("${THEME_KEY}")
            if (typeof storedTheme === "string") {
                return storedTheme;
            }

            const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
            if (userMedia?.matches) {
                return "${Theme.dark}";
            }

            return "${Theme.light}";
        }


		const root = document.documentElement;
        const theme = getTheme();

		if (theme === "${Theme.dark}") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
    })();
    `;

	return <script dangerouslySetInnerHTML={{ __html: script }} />;
};
