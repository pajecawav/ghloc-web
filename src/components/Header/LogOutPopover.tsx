import { useTokenStore } from "@/stores/useTokenStore";
import { Dialog, Popover, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, useState } from "react";
import { LogoutIcon } from "@heroicons/react/outline";
import { Button } from "../Button";
import toast from "react-hot-toast";
import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@/contexts/ThemeContext";

type Props = {
	buttonClassNames?: string;
};

export const LogOutPopover = ({ buttonClassNames }: Props) => {
	const { removeToken } = useTokenStore();
	const { theme } = useTheme();

	const logout = () => {
		removeToken();
		toast("You have successfully signed out.");
	};

	return (
		<Popover className="relative grid">
			<Popover.Button
				className={classNames(buttonClassNames)}
				title="Log out"
			>
				<LogoutIcon />
			</Popover.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-75"
				enterFrom="opacity-0 scale-95"
				leave="transition ease-out duration-75"
				leaveTo="opacity-0 scale-95"
			>
				<Popover.Panel className="absolute w-72 max-w-[calc(100vw-1rem)] flex flex-col gap-2 z-10 top-9 right-0 px-4 py-3 origin-top-right bg-normal shadow rounded-lg border border-normal text-sm">
					<p>
						Logging out will lower the GitHub API quota available to
						you.
					</p>

					<p className="text-sm">
						Don&apos;t forget to{" "}
						<a
							className="text-link-normal hover:underline"
							href="https://github.com/settings/applications"
							target="_blank"
							rel="noopener noreferrer"
						>
							revoke access
						</a>{" "}
						in GitHub settings.
					</p>

					<Button className="mx-auto" onClick={() => logout()}>
						Log out
					</Button>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};
