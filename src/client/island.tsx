import { parse } from "devalue";
import { FC, render } from "hono/jsx/dom";
// TODO: is this needed?
// import "vite/modulepreload-polyfill";
import { ensureLeadingSlash } from "~/lib/utils";

const ISLANDS = import.meta.glob<FC>("/src/islands/*.tsx", { import: "default" });

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
				const el = document.createElement("div");
				render(<Component {...islandProps} />, el);
				this.replaceWith(el);
			});
		}
	},
);
