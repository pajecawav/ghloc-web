import { useEffect, useState } from "hono/jsx";

export const useDebouncedValue = <T,>(value: T, ms: number) => {
	const [_value, setValue] = useState(value);

	useEffect(() => {
		if (!ms) {
			return;
		}

		const timeout = setTimeout(() => setValue(value), ms);

		return () => {
			clearTimeout(timeout);
		};
	}, [value, ms]);

	return _value;
};
