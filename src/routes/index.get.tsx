import { IndexPage } from "~/pages/index";
import { renderPage } from "~/render";

export default defineEventHandler(event => {
	return renderPage(<IndexPage />, {
		event,
	});
});
