const path = require("path");

/** @type {import('next').NextConfig} */
let config = {
	reactStrictMode: true,
	webpack(config) {
		config.resolve.alias["@"] = path.join(__dirname, "src");
		return config;
	},
};

if (process.env.ANALYZE === "true") {
	const withStatoscope = require("next-statoscope")();
	config = withStatoscope(config);
}

module.exports = config;
