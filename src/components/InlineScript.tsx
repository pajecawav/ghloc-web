import { Theme, THEME_LS_KEY } from "~/lib/theme";

const script = `
(function () {
    function getTheme() {
        const storedTheme = window.localStorage.getItem("${THEME_LS_KEY}")
        if (typeof storedTheme === "string") {
            return storedTheme;
        }

        const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
        if (userMedia?.matches) {
            return "${Theme.DARK}";
        }

        return "${Theme.LIGHT}";
    }


    const root = document.documentElement;
    const theme = getTheme();

	root.classList.toggle("dark", theme === "${Theme.DARK}");
})();
`;

export const InlineScript = () => {
	return <script dangerouslySetInnerHTML={{ __html: script }} />;
};
