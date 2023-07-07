import { useTokenStore } from "@/stores/useTokenStore";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { FormEvent, Fragment, useRef, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface Props {
	onClose: () => void;
}

export function GitHubTokenModal({ onClose }: Props) {
	const { token, setToken, removeToken } = useTokenStore();
	const [newToken, setNewToken] = useState(token);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newToken) {
			setToken(newToken);
		} else {
			removeToken();
		}

		onClose();
	};

	return (
		<Dialog
			as="div"
			className="fixed inset-0 z-10 overflow-y-auto"
			open={true}
			onClose={onClose}
			initialFocus={closeButtonRef}
		>
			<div className="h-full px-4 grid place-items-center">
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />

				<div className="z-20 w-full max-w-lg flex flex-col gap-2 p-4 rounded-md bg-normal overflow-hidden">
					<div className="flex justify-between">
						<Dialog.Title className="text-2xl font-medium">
							Add GitHub Access Token
						</Dialog.Title>
						<button
							className="w-6 h-6"
							onClick={() => onClose()}
							ref={closeButtonRef}
						>
							<XIcon />
						</button>
					</div>

					<p>
						You can provide{" "}
						<a
							href="https://github.com/settings/tokens"
							className="text-link-normal hover:underline"
							rel="noopener noreferrer"
							target="_blank"
						>
							personal access token
						</a>{" "}
						to increase{" "}
						<a
							href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api"
							className="text-link-normal hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub API rate limit.
						</a>
					</p>

					<p>
						If you don&apos;t have one you need to{" "}
						<a
							href="https://github.com/settings/tokens/new"
							className="text-link-normal hover:underline"
							rel="noopener noreferrer"
							target="_blank"
						>
							create it
						</a>{" "}
						first. No personal scopes are required.
					</p>

					<form onSubmit={handleSubmit}>
						<label
							className="block w-max font-medium my-1"
							htmlFor="token"
						>
							Access token (stored in local storage)
						</label>

						<div className="flex gap-2">
							<Input
								id="token"
								className="py-1 flex-1"
								type="text"
								value={newToken}
								onChange={e => setNewToken(e.target.value)}
							/>

							<Button type="submit">Save</Button>
						</div>
					</form>
				</div>
			</div>
		</Dialog>
	);
}
