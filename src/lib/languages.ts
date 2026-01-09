import * as languagesJson from "../languages-map.json";

interface LanguagesMap {
	extensions: Record<string, string>;
	filenames: Record<string, string>;
}

const languages = languagesJson as LanguagesMap;

export const getLanguageFromExtension = (extension: string, filename?: string): string | null => {
	filename = filename?.toLowerCase();
	if (filename && languages.filenames[filename]) {
		return languages.filenames[filename];
	}

	if (extension.startsWith(".")) {
		extension = extension.slice(1);
	}

	extension = extension.toLowerCase();

	return languages.extensions[extension] ?? languages.filenames[extension] ?? null;
};
