import yamf from "@pajecawav/yamf/vite";
import tailwindcss from "@tailwindcss/vite";
import { rolldown } from "rolldown";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";

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
				compatibilityDate: "2026-08-02",
				preset: process.env.VERCEL ? "vercel" : undefined,
			},
		}),
		tailwindcss(),
		bundledStringPlugin(),
		process.env.ANALYZE &&
			visualizer({
				open: true,
				filename: "node_modules/.cache/visualizer.html",
				gzipSize: true,
				brotliSize: true,
			}),
	],
});

function bundledStringPlugin(): PluginOption {
	return {
		name: "bundled-string",
		load: {
			filter: {
				id: /\?bundle$/,
			},
			async handler(id: string) {
				const entry = id.replace(/\?bundle$/, "");

				const bundle = await rolldown({
					input: entry,
				});

				const output = await bundle.generate({
					format: "iife",
					minify: true,
				});

				const chunk = output.output.find(o => o.type === "chunk");

				if (!chunk) {
					throw new Error("No chunk found");
				}

				return `export default ${JSON.stringify(chunk.code)}`;
			},
		},
	};
}
