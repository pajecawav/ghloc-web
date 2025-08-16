import { Child } from "hono/jsx";

interface ErrorPlaceholderProps {
	children: Child;
}

export const ErrorPlaceholder = ({ children }: ErrorPlaceholderProps) => {
	return <div class="text-muted">{children}</div>;
};
