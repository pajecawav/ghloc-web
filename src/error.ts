import { defineErrorHandler } from "nitro";
import type { NitroErrorHandler } from "nitro/types";

const errorHandler: NitroErrorHandler = defineErrorHandler(error => {
	console.error(error);
	return new Response(`${error.statusCode} ${error.statusMessage ?? "Something went wrong"}`);
});

export default errorHandler;
