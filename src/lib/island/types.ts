import { FC } from "hono/jsx";

export type IslandFC<P = any> = FC<P> & { src?: string };
