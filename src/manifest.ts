import { Manifest } from "vite";

export const useManifest = () => {
	return useStorage("assets:vite").getItem<Manifest | null>("manifest.json");
};
