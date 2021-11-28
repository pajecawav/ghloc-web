const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
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
			textColor: {
				normal: "var(--colors-text-normal)",
				subtle: "var(--colors-text-subtle)",
				muted: "var(--colors-text-muted)",

				"bg-accent": "var(--colors-bg-accent)",

				"border-active": "var(--colors-border-active)",
				"border-active2": "var(--colors-border-active2)",
			},
			backgroundColor: {
				normal: "var(--colors-bg-normal)",
				accent: "var(--colors-bg-accent)",
				accent2: "var(--colors-bg-accent2)",
			},
			borderColor: {
				normal: "var(--colors-border-normal)",
				active: "var(--colors-border-active)",
				active2: "var(--colors-border-active2)",

				"bg-accent2": "var(--colors-bg-accent2)",
			},
			divideColor: {
				normal: "var(--colors-border-normal)",
			},
			placeholderColor: {
				"text-muted": "var(--colors-text-muted)",
			},
			colors: {
				warmGray: colors.warmGray,

				// success/error
				success: "var(--colors-success)",
				error: "var(--colors-error)",

				// links
				"link-normal": "var(--colors-link-normal)",
				"link-secondary": "var(--colors-link-secondary)",

				// buttons
				"btn-normal-bg": "var(--colors-btn-normal-bg)",
				"btn-normal-text": "var(--colors-btn-normal-text)",

				// select
				"select-active": "var(--colors-select-active)",

				// badge
				"badge-normal-bg": "var(--colors-badge-normal-bg)",
				"badge-normal-text": "var(--colors-badge-normal-text)",
				"badge-outlined-bg": "var(--colors-badge-outlined-bg)",
				"badge-outlined-text": "var(--colors-badge-outlined-text)",

				// inline code
				"code-normal-bg": "var(--colors-code-normal-bg)",
				"code-normal-text": "var(--colors-code-normal-text)",

				// heatmap levels
				"heat-level1": "var(--colors-heat-level1)",
				"heat-level2": "var(--colors-heat-level2)",
				"heat-level3": "var(--colors-heat-level3)",
				"heat-level4": "var(--colors-heat-level4)",
			},
		},
	},
	variants: {},
	plugins: [],
};
