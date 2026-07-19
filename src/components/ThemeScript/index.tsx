import script from "./script?bundle";

export const ThemeScript = () => {
	return <script dangerouslySetInnerHTML={{ __html: script }} />;
};
