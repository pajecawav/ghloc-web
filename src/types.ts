export type LocsChild = Locs | number;

export interface Locs {
	loc: number;
	locByLangs: Record<string, number>;
	children?: Record<string, LocsChild>;
}
