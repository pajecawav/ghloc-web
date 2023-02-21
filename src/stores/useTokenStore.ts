import Cookies from "js-cookie";
import { create } from "zustand";

type Store = {
	token?: string;
	setToken: (token: string) => void;
	removeToken: () => void;
};

const COOKIE_NAME = "token";

export const useTokenStore = create<Store>()(set => ({
	token: Cookies.get(COOKIE_NAME),
	setToken(token: string) {
		set({ token });
		Cookies.set(COOKIE_NAME, token, { sameSite: "lax", secure: true });
	},
	removeToken() {
		set({ token: undefined });
		Cookies.remove(COOKIE_NAME);
	},
}));
