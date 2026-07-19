import { definePage } from "@pajecawav/yamf";
import { setHeader } from "nitro/h3";
import { OwnerPage } from "~/components/repo/owner";
import { buildPageTitle } from "~/lib/title";

export default definePage({
	render: (event, { head }) => {
		const { owner } = event.context.params ?? {};

		setHeader(event, "cache-control", "public, max-age=60");

		head.push({ title: buildPageTitle(owner) });

		return <OwnerPage owner={owner} />;
	},
});
