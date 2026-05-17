import { defineOxfmtConfig } from "@pajecawav/tools";

export default defineOxfmtConfig({
	ignorePatterns: [
		"src/languages-map.json",
		"dist",
		"dist-vite",
		".output",
		".nitro",
		"pnpm-lock.yaml",
	],
	sortTailwindcss: {
		stylesheet: "./src/client/index.css",
		functions: ["cn"],
	},
});
