import type { NitroErrorHandler } from "nitropack";

const errorHandler: NitroErrorHandler = (error, event) => {
	console.error(error);
	event.node.res.end(`${error.statusCode} ${error.statusMessage ?? "Something went wrong"}`);
};

export default errorHandler;
