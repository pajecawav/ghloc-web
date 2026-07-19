import yamf from "@pajecawav/yamf/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		sourcemap: true,
	},
	plugins: [
		yamf({
			nitro: {
				errorHandler: "./src/error.ts",
				compatibilityDate: "2025-07-22",
				preset: process.env.VERCEL ? "vercel" : undefined,
			},
		}),
		tailwindcss(),
	],
});
