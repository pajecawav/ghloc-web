import { JSX } from "hono/jsx";

export const ChromeIcon = (props: JSX.HTMLAttributes) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			{...props}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m10.992 20.946l4.122-7.146M4.755 6.654L8.886 13.8m11.367-5.4H12m0 7.2a3.6 3.6 0 1 0 0-7.2a3.6 3.6 0 0 0 0 7.2"
			/>
			<path d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18" />
		</svg>
	);
};
