import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
	token?: string;
	setToken: (token: string) => void;
	removeToken: () => void;
};

// TODO: enable later?
// const COOKIE_NAME = "token";

// export const useTokenStore = create<Store>()(set => ({
// 	token: Cookies.get(COOKIE_NAME),
// 	setToken(token: string) {
// 		set({ token });
// 		Cookies.set(COOKIE_NAME, token, { sameSite: "lax", secure: true });
// 	},
// 	removeToken() {
// 		set({ token: undefined });
// 		Cookies.remove(COOKIE_NAME);
// 	},
// }));

export const useTokenStore = create<Store>()(
	persist(
		set => ({
			token: undefined,
			setToken: (token: string) => set({ token }),
			removeToken: () => set({ token: undefined }),
		}),
		{ name: "ghloc.token" }
	)
);
