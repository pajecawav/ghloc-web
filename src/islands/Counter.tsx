import { useState } from "hono/jsx";

export interface CounterProps {
	initialValue: number;
}

export default function Counter({ initialValue }: CounterProps) {
	const [value, setValue] = useState(initialValue);

	return (
		<button class="text-red-800" onClick={() => setValue(value + 1)}>
			{value}
		</button>
	);
}
