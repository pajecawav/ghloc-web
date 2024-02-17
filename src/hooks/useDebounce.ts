import { useEffect, useRef } from "react";

export function useDebounce(cb: () => void, ms: number | null, dependencies: unknown[] = []) {
	const cbRef = useRef(cb);
	const timeoutIdRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		cbRef.current = cb;
	}, [cb]);

	useEffect(() => {
		clearTimeout(timeoutIdRef.current);
		timeoutIdRef.current = undefined;

		if (ms) {
			timeoutIdRef.current = window.setTimeout(() => cbRef.current(), ms);
			return () => clearTimeout(timeoutIdRef.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ms, ...dependencies]);
}
