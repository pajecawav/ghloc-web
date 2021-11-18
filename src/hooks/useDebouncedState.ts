import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

export function useDebouncedState<S>(initialState: S | (() => S), ms: number) {
	const [state, setState] = useState(initialState);
	const [debounced, setDebounced] = useState(initialState);

	useEffect(() => {
		const timeoutId = setTimeout(() => setDebounced(state), ms);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [state, ms]);

	return { state, debounced, setState };
}
