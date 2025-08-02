import { IndexPage } from "~/pages/index";
import { renderPage } from "~/render";

export default defineEventHandler(event => {
	setHeader(event, "cache-control", "public, max-age=60");

	return renderPage(<IndexPage />, {
		event,
	});
});
