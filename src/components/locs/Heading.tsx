type Props = {
	text: string;
};

export const Heading = ({ text }: Props) => {
	return <h2 className="text-lg font-semibold">{text}</h2>;
};
