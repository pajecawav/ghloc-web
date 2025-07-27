import { stringify } from "devalue";
import { FC } from "hono/jsx";
import { useSSRContext } from "./context";

interface IslandProps<P> {
	Component: FC<P>;
	props: P;
}

export const Island = <P,>({ Component, props }: IslandProps<P>) => {
	const { manifest } = useSSRContext();

	const islandRe = new RegExp(`/${Component.name}.island.tsx?$`);
	const src = Object.keys(manifest).find(path => islandRe.test(path));

	if (!src) {
		throw new Error(`Missing island definition in manifest for island ${Component.name}`);
	}

	return (
		<ghloc-island island-props={stringify(props)} island-src={src}>
			{/* @ts-expect-error can't be bothered to figure out */}
			<Component {...props} />
		</ghloc-island>
	);
};
