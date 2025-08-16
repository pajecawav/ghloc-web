import { Child } from "hono/jsx";
import { RouterContext, RouterContextValue } from "./context";

interface RouterProps extends RouterContextValue {
	children: Child;
}

export const Router = ({ children, ...value }: RouterProps) => {
	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};
