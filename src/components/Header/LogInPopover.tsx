import { Popover, Transition } from "@headlessui/react";
import { LoginIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { Fragment } from "react";
import { GithubIcon } from "../icons/GithubIcon";

type Props = {
	buttonClassNames?: string;
};

export const LogInPopover = ({ buttonClassNames }: Props) => {
	return (
		<Popover className="relative grid">
			<Popover.Button
				className={classNames(buttonClassNames)}
				title="Log in with GitHub"
			>
				<LoginIcon />
			</Popover.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-75"
				enterFrom="opacity-0 scale-95"
				leave="transition ease-out duration-75"
				leaveTo="opacity-0 scale-95"
			>
				<Popover.Panel className="absolute w-80 max-w-[calc(100vw-1rem)] flex flex-col gap-2 z-10 top-9 right-0 px-4 py-3 origin-top-right bg-normal shadow rounded-lg border border-normal text-sm">
					<p>
						You can log in with GitHub to increase the GitHub API
						quota available to the application.
					</p>

					<p>
						Only public information about your GitHub profile can be
						accessed with the OAuth token and the token is stored in
						your browser.
					</p>

					<a
						href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
						className="mt-1 text-base px-3 py-1 mx-auto rounded-md bg-btn-normal-bg text-btn-normal-text"
					>
						<GithubIcon className="inline-block h-5 w-5" /> Log in
					</a>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};
