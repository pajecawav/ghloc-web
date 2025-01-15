import { GithubIcon } from "@/components/icons/GithubIcon";
import { Theme } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { CodeIcon, MoonIcon, SearchIcon, SunIcon } from "@heroicons/react/outline";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { ReactNode } from "react";
import { FirefoxIcon } from "../icons/FirefoxIcon";

type Props = {
	className?: string;
};

const HeaderItem = ({ children }: { children: ReactNode }) => {
	return (
		<li className="w-8 h-8 p-[0.3em] rounded-md transition-colors duration-100 hover:bg-accent">
			{children}
		</li>
	);
};

export const Header = ({ className }: Props) => {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className={className}>
			<ul className="flex items-center justify-end h-8">
				<HeaderItem>
					<Link href="/" title="Search repos">
						<SearchIcon />
					</Link>
				</HeaderItem>
				<HeaderItem>
					<button
						className="w-full h-full"
						onClick={toggleTheme}
						title="Toggle dark mode"
						// this thing doesn't silence mismatch in icons. we are ok with the mismatch
						// because we inject a ThemeScript on the client
						suppressHydrationWarning
					>
						{theme === Theme.light ? <MoonIcon /> : <SunIcon />}
					</button>
				</HeaderItem>
				<HeaderItem>
					<a
						href="https://github.com/pajecawav/ghloc-web"
						target="_blank"
						rel="noopener noreferrer"
						title="Project source code"
						onClick={() => track("github")}
					>
						<GithubIcon />
					</a>
				</HeaderItem>
				<HeaderItem>
					<a
						href="https://addons.mozilla.org/firefox/addon/github-lines-of-code"
						target="_blank"
						rel="noopener noreferrer"
						title="Firefox addon"
						onClick={() => track("firefox")}
					>
						<FirefoxIcon />
					</a>
				</HeaderItem>
				<HeaderItem>
					<a
						href="https://gist.github.com/pajecawav/70ffe72bf4aa0968aa9f97318976138f"
						target="_blank"
						rel="noopener noreferrer"
						title="Userscript link"
						onClick={() => track("userscript")}
					>
						<CodeIcon />
					</a>
				</HeaderItem>
			</ul>
		</header>
	);
};
