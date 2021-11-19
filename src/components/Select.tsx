import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import React, { ComponentType, Fragment } from "react";

export type SelectOption = {
	name: string;
	icon?: ComponentType;
};

type Props = {
	value: string;
	options: Record<string, SelectOption>;
	onChange: (value: string) => void;
	className?: string;
};

export const Select = ({ value, options, onChange, className }: Props) => {
	const selected = options[value as keyof typeof options];

	return (
		<Listbox value={value} onChange={onChange}>
			<div className={classNames("relative rounded-md", className)}>
				<Listbox.Button className="relative w-full h-full pl-3 pr-10 text-left rounded-md outline-none border-2 transition-colors duration-100 group focus:border-gray-600">
					<span className="block truncate">{selected.name}</span>
					<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<ChevronDownIcon
							className="w-4 h-4 text-gray-400 transition-transform duration-300 group-focus:text-black"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute w-full py-1 mt-1 border overflow-auto bg-white rounded-md shadow-lg max-h-60 focus:outline-none">
						{Object.entries(options).map(
							([optionValue, option]) => (
								<Listbox.Option
									key={optionValue}
									className={({ active }) =>
										classNames(
											active && "bg-gray-200/80",
											"select-none relative py-1 px-3 cursor-pointer"
										)
									}
									value={optionValue}
								>
									{({ selected }) => (
										<span
											className={classNames(
												selected
													? "font-medium"
													: "font-normal",
												"block truncate"
											)}
										>
											{option.name}
										</span>
									)}
								</Listbox.Option>
							)
						)}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
};
