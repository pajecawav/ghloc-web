import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { ReactNode } from "react";
type Props = {
	className?: string;
};

const Code = ({ children }: { children: ReactNode }) => {
	return (
		<code className="px-1 py-0.5 bg-blue-100/80 rounded-md selection:bg-gray-400 selection:text-white">
			{children}
		</code>
	);
};

export const FilterHelpTooltip = ({ className }: Props) => {
	return (
		<div className={classNames("relative group", className)}>
			<button className="w-5 h-5 align-middle transition-colors duration-75 text-gray-600 focus:text-black">
				<QuestionMarkCircleIcon />
			</button>

			<div
				className={classNames(
					"absolute top-0 mt-8 right-0 h-max w-96 max-w-[calc(100vw-1rem)] border border-gray-200 shadow-lg rounded-lg bg-white px-4 py-2 text-xs text-gray-700",
					"transition duration-75 ease-out scale-95 opacity-0",
					"group-focus-within:duration-100 group-focus-within:opacity-100 group-focus-within:scale-100",
					"group-hover:duration-100 group-hover:opacity-100 group-hover:scale-100",
					"pointer-events-none group-focus-within:pointer-events-auto group-hover:pointer-events-auto"
				)}
			>
				<h3 className="text-base text-black mb-1">
					Filter syntax examples
				</h3>
				<ul className="leading-relaxed list-disc list-inside">
					<li>
						<Code>filter=test,.sum</Code> will ignore paths
						containing <Code>test</Code> or <Code>.sum</Code>.
					</li>
					<li>
						<Code>filter=_test.go$,^docs/</Code> will ignore paths
						ending with <Code>_test.go</Code> or starting with{" "}
						<Code>docs/</Code>.
					</li>
					<li>
						<Code>filter=.md$,!^README.md$</Code> will ignore all
						Markdown files (i.e. ending with <Code>.md</Code>)
						except for
						<Code>README.md</Code> in the root of the repository.
					</li>
					<li>
						<Code>filter=</Code> will ignore all paths (you will get
						empty results).
					</li>
					<li>
						<Code>filter=,!.go</Code> will only include paths
						containing <Code>.go</Code>.
					</li>
					<li>
						<Code>filter=,!.go$</Code> will only include files with{" "}
						<Code>.go</Code> extension.
					</li>
					<li>
						<Code>filter=,!^src/</Code> will filter all paths,
						except for the ones starting with <Code>src/</Code>{" "}
						(i.e. placed in the <Code>src</Code>
						folder).
					</li>
				</ul>
				<p className="mt-1">
					See{" "}
					<a
						className="text-blue-500 hover:underline"
						href="https://github.com/subtle-byte/ghloc#readme"
						target="_blank"
						rel="noopener noreferrer"
					>
						ghloc
					</a>{" "}
					for details.
				</p>
			</div>
		</div>
	);
};
