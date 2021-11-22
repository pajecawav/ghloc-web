import { GithubIcon } from "@/components/icons/GithubIcon";
import { Theme } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { MoonIcon, SearchIcon, SunIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";

type Props = {
	className?: string;
};

export const Header = ({ className }: Props) => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div
			className={classNames("flex gap-3 items-center ml-auto", className)}
		>
			<Link href="/">
				<a
					className="w-6 h-6 transition-all duration-100 hover:text-secondary-link active:scale-90"
					title="Search repos"
				>
					<SearchIcon />
				</a>
			</Link>
			<button
				className="w-6 h-6 transition-all duration-100 hover:text-secondary-link active:scale-90"
				onClick={toggleTheme}
				title="Toggle dark mode"
			>
				{theme !== undefined &&
					(theme === Theme.light ? <SunIcon /> : <MoonIcon />)}
			</button>
			<a
				className="w-5 h-5 transition-all duration-100 hover:text-secondary-link active:scale-90"
				href="https://github.com/pajecawav/repo-stats"
				target="_blank"
				rel="noopener noreferrer"
				title="Link to Github"
			>
				<GithubIcon />
			</a>
		</div>
	);
};
