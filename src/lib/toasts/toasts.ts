import { Toast, ToastOptions } from "./types";

const DISMISS_MS = 4_000;

let nextId = 1;

export class Toasts {
	private toasts: Toast[] = [];
	private dismissTimeouts = new Map<string, number>();
	private subscribers = new Set<VoidFunction>();

	public getToasts = () => {
		return this.toasts;
	};

	public show = (options: ToastOptions) => {
		const id = options.id ?? `__${nextId++}`;

		this.toasts = [...this.toasts, { ...options, id, dismissed: true }];

		this.dismissTimeouts.delete(id);

		const dismiss = () => this.dismiss(id);
		const dismissTimeout = window.setTimeout(dismiss, DISMISS_MS);
		this.dismissTimeouts.set(id, dismissTimeout);

		// TODO: remove dismissed toasts from array

		this.notify();

		return dismiss;
	};

	public dismiss = (id: string) => {
		const toast = this.toasts.find(toast => toast.id == id);

		if (toast) {
			toast.dismissed = false;
		}

		this.toasts = [...this.toasts];

		this.notify();
	};

	public remove = (id: string) => {
		this.toasts = this.toasts.filter(toast => toast.id !== id);

		this.notify();
	};

	public subscribe = (cb: VoidFunction) => {
		this.subscribers.add(cb);

		return () => this.subscribers.delete(cb);
	};

	private notify = () => {
		this.subscribers.forEach(cb => cb());
	};
}

export const toast = new Toasts();
