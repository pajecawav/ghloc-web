import { GithubIcon } from "@/components/icons/GithubIcon";
import { Theme } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { CogIcon, MoonIcon, SearchIcon, SunIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { GitHubTokenModal } from "../GitHubTokenModal";
import { FirefoxIcon } from "../icons/FirefoxIcon";
import styles from "./Header.module.css";

type Props = {
	className?: string;
};

export const Header = ({ className }: Props) => {
	const { theme, toggleTheme } = useTheme();
	const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

	// hide icons on initial render to avoid hydration mismatch
	const showIcons = theme !== undefined;

	return (
		<header className={className}>
			<ul className="flex gap-3 items-center justify-end">
				{showIcons && (
					<>
						<li>
							<Link href="/">
								<a
									className={classNames(
										styles.icon,
										"block w-6 h-6 hover:text-link-secondary",
										"hover:transition-all hover:duration-100"
									)}
									title="Search repos"
								>
									<SearchIcon />
								</a>
							</Link>
						</li>
						<li>
							<button
								className={classNames(
									styles.icon,
									"block w-6 h-6 hover:text-link-secondary active:scale-90",
									// NOTE: styles.icon adds an appear animation on
									// transform and it's duration interferes with
									// transition-duration so we have to conditionally
									// apply it
									"hover:transition-all hover:duration-100",
									"active:transition-all active:duration-100"
								)}
								onClick={toggleTheme}
								title="Toggle dark mode"
							>
								{theme === Theme.light ? (
									<MoonIcon />
								) : (
									<SunIcon />
								)}
							</button>
						</li>
						<li>
							<a
								className={classNames(
									styles.icon,
									"block w-5 h-5 hover:text-link-secondary active:scale-90",
									"hover:transition-all hover:duration-100",
									"umami--click--github-button"
								)}
								href="https://github.com/pajecawav/ghloc-web"
								target="_blank"
								rel="noopener noreferrer"
								title="Project source code"
							>
								<GithubIcon />
							</a>
						</li>
						<li>
							<a
								className={classNames(
									styles.icon,
									"block w-5 h-5 hover:text-link-secondary active:scale-90",
									"hover:transition-all hover:duration-100",
									"umami--click--firefox-addon-button"
								)}
								href="https://addons.mozilla.org/ru/firefox/addon/github-lines-of-code"
								target="_blank"
								rel="noopener noreferrer"
								title="Firefox addon"
							>
								<FirefoxIcon />
							</a>
						</li>
						<li>
							<button
								className={classNames(
									styles.icon,
									"block w-6 h-6 hover:text-link-secondary active:scale-90",
									"hover:transition-all hover:duration-100",
									"active:transition-all active:duration-100"
								)}
								onClick={() => setIsTokenModalOpen(true)}
							>
								<CogIcon />
							</button>
							<GitHubTokenModal
								isOpen={isTokenModalOpen}
								onClose={() => setIsTokenModalOpen(false)}
							/>
						</li>
					</>
				)}
			</ul>
		</header>
	);
};
