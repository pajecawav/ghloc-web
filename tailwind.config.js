const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	mode: "jit",
	purge: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				"accent-fg": "#0969da",
			},
		},
		screens: {
			xs: "475px",
			...defaultTheme.screens,
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
