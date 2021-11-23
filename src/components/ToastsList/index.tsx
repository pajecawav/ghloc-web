import { InformationCircleIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import React, { ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./ToastsList.module.css";

type ToastType = "blank" | "success" | "error";

const typeClassnames: Record<ToastType, string> = {
	blank: "bg-accent2-bg border-accent2-bg/50",
	success: "bg-success border-success/75 text-gray-900",
	error: "bg-error border-error/75 text-gray-900",
};

const typeIcons: Record<ToastType, ReactNode> = {
	blank: <InformationCircleIcon />,
	success: <CheckCircleIcon />,
	error: <ExclamationCircleIcon />,
};

export const ToastsList = () => {
	return (
		<Toaster
			position="bottom-right"
			reverseOrder={false}
			gutter={8}
			toastOptions={{
				duration: 10 * 1000,
				error: {
					duration: Infinity,
				},
			}}
		>
			{t => (
				<div
					className={classNames(
						"relative max-w-xs flex gap-2 pl-3 pr-8 py-3 rounded-lg items-start font-medium border border-normal-border shadow",
						typeClassnames[t.type as ToastType],
						t.visible ? styles.appear : styles.dismiss
					)}
				>
					{typeIcons[t.type as ToastType] && (
						<div className="w-6 h-6 flex-shrink-0">
							{typeIcons[t.type as ToastType]}
						</div>
					)}
					<div>{t.message}</div>
					{t.type !== "loading" && (
						<button
							className="absolute top-3 right-2"
							onClick={() => toast.dismiss(t.id)}
						>
							<XIcon className="w-4 h-4" />
						</button>
					)}
				</div>
			)}
		</Toaster>
	);
};
