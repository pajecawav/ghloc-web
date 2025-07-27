import { JSX } from "hono/jsx";
import { cn } from "~/lib/utils";

export const Link = ({ class: _class, ...props }: JSX.IntrinsicElements["a"]) => {
	return <a class={cn(_class, "text-link hover:underline")} {...props} />;
};
