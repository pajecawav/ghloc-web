import { defineOxfmtConfig } from "@pajecawav/tools";

export default defineOxfmtConfig({
	ignorePatterns: ["src/languages-map.json", "dist", ".output", ".nitro"],
	sortTailwindcss: {
		stylesheet: "./src/root/index.css",
		functions: ["cn"],
	},
});
