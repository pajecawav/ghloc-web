import { Island } from "~/lib/island";
import { CodeIcon } from "../icons/CodeIcon";
import { FirefoxIcon } from "../icons/FirefoxIcon";
import { GitHubIcon } from "../icons/GitHubIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { HeaderItem } from "./HeaderItem";
import ThemeToggle from "./ThemeToggle.island";

export const Header = () => {
	return (
		<header class="mb-1">
			<div class="xs:gap-0 flex justify-end gap-1">
				<a href="/" title="Search repos">
					<HeaderItem>
						<SearchIcon />
					</HeaderItem>
				</a>
				<Island Component={ThemeToggle} props={{}} />
				<a
					href="https://github.com/pajecawav/ghloc-web"
					target="_blank"
					rel="noopener"
					title="Project source code"
				>
					<HeaderItem>
						<GitHubIcon />
					</HeaderItem>
				</a>
				<a
					href="https://addons.mozilla.org/firefox/addon/github-lines-of-code"
					target="_blank"
					rel="noopener"
					title="Firefox addon"
				>
					<HeaderItem>
						<FirefoxIcon />
					</HeaderItem>
				</a>
				<a
					href="https://gist.github.com/pajecawav/70ffe72bf4aa0968aa9f97318976138f"
					target="_blank"
					rel="noopener"
					title="Userscript link"
				>
					<HeaderItem>
						<CodeIcon />
					</HeaderItem>
				</a>
			</div>
		</header>
	);
};
