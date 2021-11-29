import { useTokenStore } from "../stores/useTokenStore";

export const useIsLoggedIn = () => {
	return useTokenStore(state => !!state.token);
};
