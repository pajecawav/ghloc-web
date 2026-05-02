import { $fetch } from "ofetch";
import { isClient } from "./utils";

export const baseFetcher = $fetch.create(isClient ? {} : { headers: { "User-Agent": "ghloc" } });
