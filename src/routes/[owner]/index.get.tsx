import { OwnerPage } from "~/pages/repo/owner";
import { renderPage } from "~/render";

export default defineEventHandler(event => {
	const { owner } = getRouterParams(event);

	setHeader(event, "cache-control", "public, max-age=60");

	return renderPage(<OwnerPage owner={owner} />, {
		event,
		title: owner,
	});
});
