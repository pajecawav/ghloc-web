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
		const timings = event.context.timing.getEntries();

		if (timings.length) {
			console.log(`${url} timings:\n`, timings);
		}
	});
});
