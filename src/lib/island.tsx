import { stringify } from "devalue";
import { FC } from "hono/jsx";
import { useSSRContext } from "./context";

interface IslandProps<P> {
	Component: FC<P>;
	props: P;
}

export const Island = <P,>({ Component, props }: IslandProps<P>) => {
	const { manifest } = useSSRContext();

	const src = Object.entries(manifest).find(([, chunk]) => chunk.name === Component.name)?.[0];

	if (!src) {
		throw new Error(`Missing island definition in manifest for island ${Component.name}`);
	}

	return (
		<ghloc-island island-props={stringify(props)} island-src={src}>
			<Component {...props} />
		</ghloc-island>
	);
};
