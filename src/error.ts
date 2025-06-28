import type { NitroErrorHandler } from "nitropack";

const errorHandler: NitroErrorHandler = (error, event) => {
	console.error(error);
	event.node.res.end(`${error.statusCode} ${error.message}`);
};

export default errorHandler;
