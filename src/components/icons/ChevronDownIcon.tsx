import { JSX } from "hono/jsx";

export const ChevronDownIcon = (props: JSX.HTMLAttributes) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width={2}
			stroke="currentColor"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
		</svg>
	);
};
