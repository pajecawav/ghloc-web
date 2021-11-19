const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack(config) {
		config.resolve.alias["@"] = path.join(__dirname, "src");
		return config;
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/pajecawav/repo-stats?branch=master",
				permanent: false,
			},
		];
	},
};
