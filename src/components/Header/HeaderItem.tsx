import { PropsWithChildren } from "hono/jsx";

export const HeaderItem = ({ children }: PropsWithChildren) => {
	return (
		<div class="h-8 w-8 rounded-md p-[0.3em] transition-colors duration-100 hover:bg-gray-100 dark:hover:bg-neutral-800">
			{children}
		</div>
	);
};
