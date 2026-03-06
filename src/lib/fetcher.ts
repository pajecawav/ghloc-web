import { $fetch } from "ofetch";

export const baseFetcher = $fetch.create({
	headers: {
		"User-Agent": "ghloc",
	},
});
