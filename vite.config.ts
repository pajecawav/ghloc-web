import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { ManifestOptions, VitePWA } from "vite-plugin-pwa";
import { CLIENT_ENTRY } from "./config";

const manifest: Partial<ManifestOptions> = {
	name: "ghloc",
	short_name: "ghloc",
	description: "Count lines of code in GitHub repository",
	icons: [
		{
			src: "/android-chrome-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			src: "/android-chrome-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
	],
	theme_color: "#000000",
	background_color: "#ffffff",
	display: "standalone",
	orientation: "portrait",
};

export default defineConfig({
	appType: "mpa",
	build: {
		manifest: true,
		sourcemap: true,
		outDir: "dist-vite",
		rollupOptions: {
			input: [CLIENT_ENTRY],
			preserveEntrySignatures: "allow-extension",
		},
	},
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		VitePWA({
			manifest,
			injectRegister: "auto",
			workbox: {
				globPatterns: ["**/*.{js,css,ico,png,svg}"],
			},
		}),
	],
});
