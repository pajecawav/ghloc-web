import { Fragment } from "hono/jsx/jsx-runtime";
import { cn } from "~/lib/utils";

interface PathBreadcrumbsProps {
	path: string[];
	onSelect: (index: number) => void;
}

export const PathBreadcrums = ({ path, onSelect }: PathBreadcrumbsProps) => {
	return (
		<div class="xs:w-auto w-full flex-grow break-all">
			{path.map((name, index) => {
				const isLast = index + 1 === path.length;

				return (
					<Fragment key={index.toString()}>
						<button
							class={cn(
								"text-left",
								isLast ? "font-medium" : "text-link cursor-pointer hover:underline",
							)}
							onClick={() => onSelect(index)}
							disabled={isLast}
						>
							{name}
						</button>{" "}
						{index + 1 < path.length && <span>/</span>}{" "}
					</Fragment>
				);
			})}
		</div>
	);
};
