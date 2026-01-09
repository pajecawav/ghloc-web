import { highlight, normalizeLanguage, detectLanguage } from "@arborium/arborium";

// samples https://github.com/bearcove/arborium/tree/4da13dd132ff9e5b62d3f35dbf4b21da3e72b094/demo/samples
// supported languages https://arborium.bearcove.eu/
const LANGUAGE_OVERRIDES: Record<string, string | undefined> = {
	"c header": "c",
	assembly: "asm",
	cc: "cpp",
	"common lisp": "commonlisp",
	"device tree": "devicetree",
	patch: "diff",
	gv: "dot",
	"emacs lisp": "elisp",
	sass: "scss",
	"nginx configuration": "nginx",
	"objective-c++": "objc",
	ps: "postscript",
	res: "rescript",
	"rusty object notation": "ron",
	racket: "scheme",
	bazel: "starlark",
	"tla+": "tlaplus",
	"visual basic": "vb",
	systemverilog: "verilog",
	"vim script": "vim",
};

export const highlightCode = async (code: string, language?: string | null) => {
	if (language) {
		language = LANGUAGE_OVERRIDES[language.toLowerCase()] || language;
	} else {
		language = language || detectLanguage(code);
	}

	if (!language) {
		return null;
	}

	return await highlight(normalizeLanguage(language.toLowerCase()), code, {
		cdn: "https://esm.sh",
		manual: true,
	});
};
