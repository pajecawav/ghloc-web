import fs from "fs";
import { resolve } from "path";
import languagesJson from "./languages.json";

const languages = languagesJson.languages;

const out = resolve(import.meta.dirname, "..", "src/languages-map.json");

type ExtensionsMap = Record<string, string>;
type FilenamesMap = Record<string, string>;

function buildLanguagesMap() {
	const extensionsMap: ExtensionsMap = {};
	const filenamesMap: FilenamesMap = {};

	for (const [key, language] of Object.entries(languages)) {
		const name = "name" in language ? language.name : key;

		if ("extensions" in language) {
			for (const extension of language.extensions) {
				extensionsMap[extension.toLowerCase()] = name;
			}
		}

		if ("filenames" in language) {
			for (const filename of language.filenames) {
				filenamesMap[filename.toLowerCase()] = name;
			}
		}
	}

	const languagesMap = {
		filenames: filenamesMap,
		extensions: extensionsMap,
	};

	fs.writeFileSync(out, JSON.stringify(languagesMap), "utf8");
}

console.log(`Generating languages map to ${out}`);
buildLanguagesMap();
