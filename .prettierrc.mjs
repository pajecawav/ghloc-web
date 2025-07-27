import base from "@pajecawav/prettier-config";

/**
 * @type {import("prettier").Config}
 */
const config = {
	...base,
	plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
