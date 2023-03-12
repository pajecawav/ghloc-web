import { ComponentProps } from "react";

interface SpinnerIconProps extends ComponentProps<"svg"> {}

export function SpinnerIcon(props: SpinnerIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
			aria-hidden="true"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10"
			/>
		</svg>
	);
}
