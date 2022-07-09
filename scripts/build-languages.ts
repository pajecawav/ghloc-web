import languagesJson from "./languages.json";
import fs from "fs";
import { resolve } from "path";

interface Language {
	name?: string;
	filenames?: string[];
	extensions?: string[];
}

const languages = languagesJson.languages as Record<string, Language>;

type ExtensionsMap = Record<string, string>;
type FilenamesMap = Record<string, string>;

function buildLanguagesMap() {
	const extensionsMap: ExtensionsMap = {};
	const filenamesMap: FilenamesMap = {};

	for (const [key, language] of Object.entries(languages)) {
		const name = language.name || key;

		if (language.extensions) {
			for (const extension of language.extensions) {
				extensionsMap[extension.toLowerCase()] = name;
			}
		}

		if (language.filenames) {
			for (const filename of language.filenames) {
				filenamesMap[filename.toLowerCase()] = name;
			}
		}
	}

	const languagesMap = {
		filenames: filenamesMap,
		extensions: extensionsMap,
	};

	fs.writeFileSync(
		resolve(__dirname, "..", "src/languages-map.json"),
		JSON.stringify(languagesMap)
	);
}

console.log("Building languages map...");
buildLanguagesMap();
