import create from "zustand";
import { persist } from "zustand/middleware";

type Store = {
	token?: string;
	setToken: (token: string) => void;
	removeToken: () => void;
};

export const useTokenStore = create<Store>(
	persist(
		set =>
			({
				token: undefined,
				setToken: (token: string) => set({ token }),
				removeToken: () => set({ token: undefined }),
			} as Store),
		{ name: "token" }
	)
);
