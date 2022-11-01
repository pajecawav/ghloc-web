import { GithubIcon } from "@/components/icons/GithubIcon";
import { Theme } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import {
	CodeIcon,
	CogIcon,
	MoonIcon,
	SearchIcon,
	SunIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { GitHubTokenModal } from "../GitHubTokenModal";
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
	const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

	// hide icons on initial render to avoid hydration mismatch
	const showIcons = theme !== undefined;

	return (
		<header className={className}>
			<ul className="flex items-center justify-end h-8">
				{showIcons && (
					<>
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
							>
								{theme === Theme.light ? (
									<MoonIcon />
								) : (
									<SunIcon />
								)}
							</button>
						</HeaderItem>
						<HeaderItem>
							<button
								className="w-full h-full"
								onClick={() => setIsTokenModalOpen(true)}
								title="Open GitHub token settings"
							>
								<CogIcon />
							</button>
							<GitHubTokenModal
								isOpen={isTokenModalOpen}
								onClose={() => setIsTokenModalOpen(false)}
							/>
						</HeaderItem>
						<HeaderItem>
							<a
								className="umami--click--github-button"
								href="https://github.com/pajecawav/ghloc-web"
								target="_blank"
								rel="noopener noreferrer"
								title="Project source code"
							>
								<GithubIcon />
							</a>
						</HeaderItem>
						<HeaderItem>
							<a
								className="umami--click--firefox-addon-button"
								href="https://addons.mozilla.org/ru/firefox/addon/github-lines-of-code"
								target="_blank"
								rel="noopener noreferrer"
								title="Firefox addon"
							>
								<FirefoxIcon />
							</a>
						</HeaderItem>
						<HeaderItem>
							<a
								className="umami--click--userscript-button"
								href="https://gist.github.com/pajecawav/70ffe72bf4aa0968aa9f97318976138f"
								target="_blank"
								rel="noopener noreferrer"
								title="Userscript link"
							>
								<CodeIcon />
							</a>
						</HeaderItem>
					</>
				)}
			</ul>
		</header>
	);
};
