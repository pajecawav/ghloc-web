import { Child, CSSProperties } from "hono/jsx";
import { cn } from "~/lib/utils";

interface TreeItemProps {
	icon?: Child;
	text: Child;
	after: Child;
	name?: string;
	class?: string;
	style?: CSSProperties;
	onClick?: VoidFunction;
	disabled?: boolean;
}

export const TreeItem = ({
	icon,
	text,
	after,
	name,
	class: _class,
	style,
	onClick,
	disabled,
}: TreeItemProps) => {
	return (
		<li class={cn("first:rounded-t-md last:rounded-b-md", _class)} style={style}>
			<button
				onClick={onClick}
				class="hover:bg-tree-active flex w-full items-center gap-2 px-2 py-1 enabled:cursor-pointer disabled:bg-transparent"
				disabled={disabled}
				title={name}
			>
				{!!icon && <span>{icon}</span>}
				<span class="truncate">{text}</span>
				<span class="ml-auto whitespace-nowrap">{after}</span>
			</button>
		</li>
	);
};
