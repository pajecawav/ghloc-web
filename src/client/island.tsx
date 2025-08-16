import { parse } from "devalue";
import { FC } from "hono/jsx/dom";
import { hydrateRoot } from "hono/jsx/dom/client";
import { ensureLeadingSlash } from "~/lib/utils";

const ISLANDS = import.meta.glob<FC>("/src/**/*.island.ts(x)?", { import: "default", eager: true });
const LAZY_ISLANDS = import.meta.glob<FC>("/src/**/*.island.lazy.ts(x)?", { import: "default" });

customElements.define(
	"ghloc-island",
	class extends HTMLElement {
		connectedCallback() {
			const islandProps = parse(this.getAttribute("island-props") ?? "{}");
			const islandSrc = this.getAttribute("island-src");

			if (!islandSrc) {
				throw new Error("Missing island-src attribute");
			}

			const hydrate = (Component: FC) => {
				hydrateRoot(this, <Component {...islandProps} />);
			};

			const src = ensureLeadingSlash(islandSrc);

			if (ISLANDS[src]) {
				hydrate(ISLANDS[src]);
			} else if (LAZY_ISLANDS[src]) {
				const loader = LAZY_ISLANDS[src];
				loader().then(hydrate);
			} else {
				throw new Error("Invalid island-src attribute");
			}
		}
	},
);
