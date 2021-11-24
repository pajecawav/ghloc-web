import { useMediaQuery } from "@/hooks/useMediaQuery";
import { InformationCircleIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import React, { ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import styles from "./ToastsList.module.css";

type ToastType = "blank" | "success" | "error" | "loading";

const typeClassnames: Record<ToastType, string> = {
	blank: "bg-accent border-bg-accent2",
	success: "bg-success border-success/75 text-gray-900",
	error: "bg-error border-error/75 text-gray-900",
	loading: "bg-accent !border-bg-accent2",
};

const typeIcons: Record<ToastType, ReactNode> = {
	blank: <InformationCircleIcon />,
	success: <CheckCircleIcon />,
	error: <ExclamationCircleIcon />,
	loading: <LoadingPlaceholder className="!text-normal" />,
};

export const ToastsList = () => {
	const isExtraSmallOrLarger = useMediaQuery("xs");

	return (
		<Toaster
			position={isExtraSmallOrLarger ? "bottom-right" : "bottom-center"}
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
						"relative max-w-sm flex gap-4 pl-3 pr-9 py-3 rounded-lg items-start font-medium border border-normal shadow text-sm xs:text-base",
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
							<XIcon className="w-6 h-6 sm:w-5 sm:h-5" />
						</button>
					)}
				</div>
			)}
		</Toaster>
	);
};
