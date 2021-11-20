const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack(config) {
		config.resolve.alias["@"] = path.join(__dirname, "src");
		return config;
	},
};
