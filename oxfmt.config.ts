import { defineOxfmtConfig } from "@pajecawav/tools";

export default defineOxfmtConfig({
	ignorePatterns: ["src/languages-map.json", "dist", ".output", ".nitro", "pnpm-lock.yaml"],
	sortTailwindcss: {
		stylesheet: "./src/root/index.css",
		functions: ["cn"],
	},
});
