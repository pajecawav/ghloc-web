import { parse } from "devalue";
import { FC } from "hono/jsx/dom";
import { hydrateRoot } from "hono/jsx/dom/client";
import { ensureLeadingSlash } from "~/lib/utils";

const ISLANDS = import.meta.glob<FC>("/src/**/*.island.ts(x)?", { import: "default" });

customElements.define(
	"ghloc-island",
	class extends HTMLElement {
		connectedCallback() {
			const islandProps = parse(this.getAttribute("island-props") ?? "{}");
			const islandSrc = this.getAttribute("island-src");

			if (!islandSrc) {
				throw new Error("Missing island-src attribute");
			}

			const loader = ISLANDS[ensureLeadingSlash(islandSrc)];

			if (!loader) {
				throw new Error("Invalid island-src attribute");
			}

			loader().then(Component => {
				hydrateRoot(this, <Component {...islandProps} />);
			});
		}
	},
);
