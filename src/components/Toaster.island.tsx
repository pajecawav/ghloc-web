import { Child } from "hono/jsx";
import { toast } from "~/lib/toasts/toasts";
import { Toast } from "~/lib/toasts/types";
import { useToasts } from "~/lib/toasts/useToasts";
import { cn } from "~/lib/utils";
import { XCircleIcon } from "./icons/XCircleIcon";

const typeClasses: Record<Toast["type"], string> = {
	error: "bg-red-100 dark:bg-red-900",
};

const typeIcons: Record<Toast["type"], Child> = {
	error: <XCircleIcon class="text-error" />,
};

export default function Toaster() {
	const toasts = useToasts();

	return (
		<div class="fixed right-4 bottom-4 ml-4 flex max-w-sm flex-col gap-2">
			{toasts.map(t => {
				return (
					<div
						key={t.id}
						class={cn(
							"border-border relative flex max-w-sm items-center gap-2 rounded-md border py-3 pr-4 pl-3 shadow",
							typeClasses[t.type],
							t.dismissed ? "animate-toast-dismiss" : "animate-toast-appear",
						)}
						onAnimationEnd={t.dismissed ? () => toast.remove(t.id) : undefined}
					>
						<div class="h-6 w-6 flex-shrink-0">{typeIcons[t.type]}</div>
						<div>{t.content}</div>
					</div>
				);
			})}
		</div>
	);
}
