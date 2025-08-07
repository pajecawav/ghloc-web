import { Child } from "hono/jsx";

export interface Toast {
	id: string;
	type: "error";
	content: Child;
	dismissed: boolean;
}

export interface ToastOptions extends Pick<Toast, "type" | "content"> {
	id?: string;
}
