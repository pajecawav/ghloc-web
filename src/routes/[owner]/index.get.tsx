import { OwnerPage } from "~/pages/repo/owner";
import { renderPage } from "~/render";

export default defineEventHandler(event => {
	const { owner } = getRouterParams(event);

	return renderPage(<OwnerPage owner={owner} />, {
		event,
		title: owner,
	});
});
