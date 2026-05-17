import { defineOxlintConfig } from "@pajecawav/tools";

export default defineOxlintConfig({
	ignorePatterns: [".output", ".nitro", ".vercel", "dist", "dist-vite"],
});
