import path from "path";
import { CLIENT_ENTRY } from "./config";

export default defineNitroConfig({
	compatibilityDate: "2025-06-28",
	srcDir: "src",
	errorHandler: "~/error",
	compressPublicAssets: {
		gzip: true,
		brotli: true,
	},
	runtimeConfig: {
		clientEntry: path.normalize(CLIENT_ENTRY),
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
				skipLibCheck: true,
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
