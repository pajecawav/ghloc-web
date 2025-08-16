import { stringify } from "devalue";
import { IslandFC } from "./types";

interface IslandProps<P> {
	Component: IslandFC<P>;
	props: P;
}

export const Island = <P,>({ Component, props }: IslandProps<P>) => {
	const src = Component.src;

	if (!src) {
		throw new Error(`Missing island src for island ${Component.name}`);
	}

	return (
		<ghloc-island island-props={stringify(props)} island-src={src}>
			{/* @ts-expect-error can't be bothered to figure out */}
			<Component {...props} />
		</ghloc-island>
	);
};
