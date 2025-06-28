import { Suspense } from "hono/jsx";
import AsyncCounter from "~/components/AsyncCounter";
import Counter from "~/islands/Counter";
import { Island } from "~/lib/island";
import { renderPage } from "~/render";

export default defineEventHandler(async event => {
	const url = getRequestURL(event);

	return renderPage(
		<div class="flex flex-col gap-2">
			<div class="text-lg text-red-400">URL: {url.pathname}</div>
			<Island Component={Counter} props={{ initialValue: 10 }} />
			<Suspense fallback="Loading...">
				<AsyncCounter initialValue={20} />
			</Suspense>
		</div>,
		{
			event,
			title: "Hello world",
		},
	);
});
