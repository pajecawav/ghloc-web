import { useSyncExternalStore } from "hono/jsx";
import { isClient } from "../utils";
import { toast } from "./toasts";

export const useToasts = () => {
	return useSyncExternalStore(
		toast.subscribe,
		toast.getToasts,
		isClient ? toast.getToasts : () => [],
	);
};
