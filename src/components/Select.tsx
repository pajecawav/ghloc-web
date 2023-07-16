import { Listbox } from "@headlessui/react";
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
	label?: string;
	className?: string;
	title?: string;
};

export const Select = ({
	value,
	options,
	onChange,
	label,
	className,
	title,
}: Props) => {
	const selected = options[value as keyof typeof options];

	return (
		<Listbox value={value} onChange={onChange}>
			<div className={classNames("relative rounded-md group", className)}>
				<Listbox.Button
					className="relative block w-full h-8 pl-3 pr-10 text-left rounded-md !outline-none border-2 border-normal transition-colors duration-100 group-focus-within:border-active"
					title={title}
				>
					<span className="block truncate">
						{label && <span className="text-muted">{label}</span>}
						{selected.name}
					</span>
					<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<ChevronDownIcon
							className="w-4 h-4 text-muted transition-transform duration-300 group-focus-within:text-border-active"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Listbox.Options className="absolute z-10 w-full py-1 mt-1 border border-normal overflow-auto bg-normal rounded-md shadow-lg max-h-60 focus:outline-none">
					{Object.entries(options).map(([optionValue, option]) => (
						<Listbox.Option
							key={optionValue}
							className={({ active }) =>
								classNames(
									active && "bg-select-active",
									"select-none relative py-1 px-3 cursor-pointer",
								)
							}
							value={optionValue}
						>
							<span className="block truncate">
								{option.name}
							</span>
						</Listbox.Option>
					))}
				</Listbox.Options>
			</div>
		</Listbox>
	);
};
