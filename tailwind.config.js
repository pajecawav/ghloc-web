const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	mode: "jit",
	purge: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		screens: {
			xs: "475px",
			...defaultTheme.screens,
		},
		extend: {
			colors: {
				// text
				"normal-text": "var(--colors-normal-text)",
				"subtle-text": "var(--colors-subtle-text)",
				"muted-text": "var(--colors-muted-text)",

				// background
				"normal-bg": "var(--colors-normal-bg)",
				"accent-bg": "var(--colors-accent-bg)",
				"accent2-bg": "var(--colors-accent2-bg)",

				// success/error
				success: "var(--colors-success)",
				error: "var(--colors-error)",

				// borders
				"normal-border": "var(--colors-normal-border)",
				"active-border": "var(--colors-active-border)",
				"active2-border": "var(--colors-active2-border)",

				// links
				"normal-link": "var(--colors-normal-link)",
				"secondary-link": "var(--colors-secondary-link)",

				// buttons
				"btn-normal-bg": "var(--colors-btn-normal-bg)",
				"btn-normal-text": "var(--colors-btn-normal-text)",

				// select
				"active-select": "var(--colors-active-select)",

				// badge
				"badge-normal-bg": "var(--colors-badge-normal-bg)",
				"badge-normal-text": "var(--colors-badge-normal-text)",
				"badge-outlined-bg": "var(--colors-badge-outlined-bg)",
				"badge-outlined-text": "var(--colors-badge-outlined-text)",

				// inline code
				"normal-code-bg": "var(--colors-normal-code-bg)",
				"normal-code-text": "var(--colors-normal-code-text)",

				// heatmap levels
				"heat-level1": "var(--colors-heat-level1)",
				"heat-level2": "var(--colors-heat-level2)",
				"heat-level3": "var(--colors-heat-level3)",
				"heat-level4": "var(--colors-heat-level4)",
			},
			stroke: {
				"normal-bg": "var(--colors-normal-bg)",
				"normal-text": "var(--colors-normal-text)",
			},
			fill: {
				"normal-bg": "var(--colors-normal-bg)",
				"normal-text": "var(--colors-normal-text)",
			},
		},
	},
	variants: {},
	plugins: [],
};
