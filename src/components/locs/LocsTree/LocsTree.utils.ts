import { LocsChild } from "@/types";

export function getValueOfChild(child: LocsChild): number {
	return typeof child === "number" ? child : child.loc;
}
