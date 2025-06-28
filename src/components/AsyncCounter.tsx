import Counter, { CounterProps } from "~/islands/Counter";
import { Island } from "~/lib/island";
import { sleep } from "~/lib/utils";

export default async function AsyncCounter(props: CounterProps) {
	await sleep(2000);

	return <Island Component={Counter} props={props} />;
}
