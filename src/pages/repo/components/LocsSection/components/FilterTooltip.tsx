import { PropsWithChildren } from "hono/jsx";
import { QuestionMarkCircleIcon } from "~/components/icons/QuestionMarkCircleIcon";
import { Link } from "~/components/Link";
import { cn } from "~/lib/utils";

const Code = ({ children }: PropsWithChildren) => {
	return (
		<code class="rounded-md bg-blue-100 px-1 py-0.5 dark:bg-blue-200 dark:text-black">
			{children}
		</code>
	);
};

export const FilterHelpTooltip = () => {
	return (
		<div class="group relative grid">
			<button
				class={cn(
					"not-focus:text-muted relative h-5 w-5 cursor-pointer transition-colors duration-75 outline-none",
					"after:absolute after:top-0 after:right-0 after:hidden after:h-[calc(100%+1.25rem)] after:w-[200%] group-focus-within:after:block group-hover:after:block",
				)}
				aria-label="Show filter syntax help"
			>
				<QuestionMarkCircleIcon />
			</button>

			<div
				class={cn(
					"absolute top-2 -right-2 z-10 mt-8 h-max w-96 max-w-[calc(100vw-1rem)] origin-top-right rounded-md border border-neutral-200 bg-white px-4 py-2 text-xs shadow-lg dark:border-neutral-700 dark:bg-neutral-900",
					"scale-95 opacity-0 transition duration-75 ease-out select-none",
					"group-focus-within:scale-100 group-focus-within:opacity-100 group-focus-within:duration-100 group-focus-within:select-text",
					"group-hover:scale-100 group-hover:opacity-100 group-hover:duration-100 group-hover:select-text",
					"pointer-events-none group-focus-within:pointer-events-auto group-hover:pointer-events-auto",
				)}
			>
				<h3 class="mb-1 text-base">Filter syntax examples</h3>
				<ul class="list-inside list-disc leading-relaxed">
					<li>
						<Code>.js</Code> will only include paths containing <Code>.js</Code>.
					</li>
					<li>
						<Code>.js$</Code> will only include files with <Code>.js</Code> extension.
					</li>
					<li>
						<Code>!test,!.lock</Code> will ignore paths containing <Code>test</Code> or{" "}
						<Code>.lock</Code>.
					</li>
					<li>
						<Code>!.test.js$,!^docs/</Code> will ignore paths ending with{" "}
						<Code>.test.js</Code> or starting with <Code>docs/</Code>.
					</li>
					<li>
						<Code>!.md$,^README.md$</Code> will ignore all Markdown files (i.e. ending
						with <Code>.md</Code>) except for <Code>README.md</Code> in the root of the
						repository.
					</li>
					<li>
						<Code>^src/</Code> will exclude all paths, except for the ones starting with{" "}
						<Code>src/</Code> (i.e. placed in the <Code>src</Code> folder).
					</li>
				</ul>
				<p class="mt-1">
					See{" "}
					<Link
						href="https://github.com/subtle-byte/ghloc#readme"
						target="_blank"
						rel="noopener"
					>
						ghloc
					</Link>{" "}
					for details.
				</p>
			</div>
		</div>
	);
};
