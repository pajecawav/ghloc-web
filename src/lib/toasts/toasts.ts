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
		const id = options.id || `__${nextId++}`;

		const existingToast = options.id ? this.findToast(options.id) : undefined;

		if (!existingToast) {
			this.toasts = [...this.toasts, { ...options, id, dismissed: false }];
		}

		window.clearTimeout(this.dismissTimeouts.get(id));

		const dismiss = () => this.dismiss(id);
		const dismissTimeout = window.setTimeout(dismiss, DISMISS_MS);
		this.dismissTimeouts.set(id, dismissTimeout);

		this.notify();

		return dismiss;
	};

	public dismiss = (id: string) => {
		const toast = this.findToast(id);

		if (toast) {
			toast.dismissed = true;
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

	private findToast = (id: string) => {
		return this.toasts.find(toast => toast.id === id && !toast.dismissed);
	};
}

export const toast = new Toasts();
