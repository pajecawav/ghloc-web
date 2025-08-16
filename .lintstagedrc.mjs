/** @type {import("lint-staged").Config} */
export default {
	"*.{js,jsx,ts,tsx,cjs,cts,json,md,yml,yaml,css}": "prettier --write",
	"src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": [() => "pnpm lint:tsc", "eslint"],
};
