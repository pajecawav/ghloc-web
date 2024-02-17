import * as languagesJson from "./languages-map.json";

interface LanguagesMap {
	extensions: Record<string, string>;
	filenames: Record<string, string>;
}

const languages = languagesJson as LanguagesMap;

export function getLanguageFromExtension(extension: string): string | null {
	if (extension.startsWith(".")) {
		extension = extension.slice(1);
	}

	extension = extension.toLowerCase();

	return languages.extensions[extension] ?? languages.filenames[extension] ?? null;
}
