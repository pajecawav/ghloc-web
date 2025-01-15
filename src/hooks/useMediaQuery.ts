import { useEffect, useState } from "react";

const Queries = {
	xs: {
		min: 475,
		max: 639,
	},
	sm: {
		min: 640,
		max: 767,
	},
	md: {
		min: 768,
		max: 1023,
	},
	lg: {
		min: 1024,
		max: 1279,
	},
	xl: {
		min: 1280,
		max: Infinity,
	},
} as const;

type Size = keyof typeof Queries;

export const useMediaQuery = (size: Size, useMax: boolean = false) => {
	const { min, max } = Queries[size];
	const mediaQuery = useMax ? `(max-width: ${max}px)` : `(min-width: ${min}px)`;

	const [matches, setMatches] = useState(
		() =>
			// always true when rendering on the server
			typeof window === "undefined" || window.matchMedia(mediaQuery).matches,
	);

	useEffect(() => {
		const updateMatch = () => setMatches(window.matchMedia(mediaQuery).matches);

		updateMatch();

		window.matchMedia(mediaQuery).addEventListener("change", updateMatch);
		return () => {
			window.matchMedia(mediaQuery).removeEventListener("change", updateMatch);
		};
	}, [mediaQuery]);

	return matches;
};
