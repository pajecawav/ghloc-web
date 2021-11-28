import { GithubIcon } from "@/components/icons/GithubIcon";
import { Theme } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { MoonIcon, SearchIcon, SunIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";
import styles from "./Header.module.css";

type Props = {
	className?: string;
};

export const Header = ({ className }: Props) => {
	const { theme, toggleTheme } = useTheme();

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
									<SunIcon />
								) : (
									<MoonIcon />
								)}
							</button>
						</li>
						<li>
							<a
								className={classNames(
									styles.icon,
									"block w-5 h-5 hover:text-link-secondary active:scale-90",
									"hover:transition-all hover:duration-100"
								)}
								href="https://github.com/pajecawav/repo-stats"
								target="_blank"
								rel="noopener noreferrer"
								title="Project source code"
							>
								<GithubIcon />
							</a>
						</li>
					</>
				)}
			</ul>
		</header>
	);
};
