import path from "path";
import { CLIENT_ENTRY } from "./config";
import { islands } from "./src/lib/island/plugin";

export default defineNitroConfig({
	compatibilityDate: "2025-07-22",
	srcDir: "src",
	errorHandler: "~/error",
	compressPublicAssets: {
		gzip: true,
		brotli: true,
	},
	runtimeConfig: {
		clientEntry: path.normalize(CLIENT_ENTRY),
	},
	rollupConfig: {
		plugins: [islands.rollup()],
	},
	publicAssets: [
		{
			baseURL: "assets",
			dir: "../dist-vite/assets",
			maxAge: 365 * 24 * 60 * 60,
		},
		{
			dir: "../dist-vite",
		},
	],
	serverAssets: [
		{
			baseName: "vite",
			dir: "../dist-vite/.vite",
		},
	],
	typescript: {
		tsConfig: {
			compilerOptions: {
				strict: true,
				jsx: "react-jsx",
				// dumb workaround because nitro's default tsconfig for some reason contains
				// jsxFactory/jsxFragmentFactory for nano-jsx
				jsxFactory: "",
				jsxFragmentFactory: "",
				jsxImportSource: "hono/jsx",
			},
		},
	},
	esbuild: {
		options: {
			jsx: "automatic",
			jsxImportSource: "hono/jsx",
		},
	},
});
