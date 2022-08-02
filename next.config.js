const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: ["true", "1"].includes(process.env.ANALYZE),
});

/** @type {import('next').NextConfig} */
let config = {
	reactStrictMode: true,
	webpack(config) {
		config.resolve.alias["@"] = path.join(__dirname, "src");
		return config;
	},
};

config = withBundleAnalyzer(config);

module.exports = config;
