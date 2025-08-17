import { ServerTiming } from "tiny-server-timing";

declare module "h3" {
	interface H3EventContext {
		timing: ServerTiming;
	}
}

export default defineNitroPlugin(nitro => {
	nitro.hooks.hook("request", event => {
		event.context.timing = new ServerTiming();
	});

	nitro.hooks.hook("afterResponse", event => {
		const url = getRequestURL(event);

		console.log(`${url} timings:\n`, event.context.timing.getEntries());
	});
});
