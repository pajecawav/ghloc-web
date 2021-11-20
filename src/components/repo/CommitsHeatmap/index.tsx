import { CommitActivity } from "@/types";
import classNames from "classnames";
import dayjs from "dayjs";
import React from "react";
import styles from "./CommitsHeatmap.module.css";

const DAY = 60 * 60 * 24;

type Props = {
	data: CommitActivity;
};

export const CommitsHeatmap = ({ data }: Props) => {
	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sut"];

	const cellSize = 16;
	const headerOffset = 17;
	const weekDaysOffset = 35;
	const randomLabelOffset = 10; // idk what this is

	const getSquareOpacity = (value: number) =>
		value ? 0.25 + 0.75 * Math.min(value / 10, 1) : 1;

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 863 128">
			<g
				className="text-green-600"
				fill="currentColor"
				transform={`translate(${weekDaysOffset}, ${headerOffset})`}
			>
				{data.map((week, weekIndex) => (
					<g
						transform={`translate(${weekIndex * cellSize}, 0)`}
						key={week.week}
					>
						{week.days.map((value, dayIndex) => (
							<rect
								className={classNames(
									styles.cell,
									!value && "text-gray-200"
								)}
								width="11"
								height="11"
								rx="2"
								ry="2"
								y={dayIndex * cellSize}
								opacity={getSquareOpacity(value)}
								key={dayIndex}
							>
								<title>
									{value} commits on{" "}
									{dayjs(
										(week.week + dayIndex * DAY) * 1000
									).format("MMM D, YYYY")}
								</title>
							</rect>
						))}
					</g>
				))}
			</g>

			<g
				className="text-gray-500 font-medium"
				fill="currentColor"
				transform={`translate(${weekDaysOffset}, 0)`}
			>
				{data.map((week, index) => {
					const date = dayjs(week.week * 1000);
					const dateEnd = date.add(1, "week");

					if (date.isSame(dateEnd, "month")) return null;

					return (
						// TODO: if new month stars this week text will overflow svg
						<text
							className="text-[12px]"
							dy={randomLabelOffset}
							dx={index * cellSize}
							key={index}
						>
							{dateEnd.format("MMM")}
						</text>
					);
				})}
			</g>

			<g
				className="text-gray-500 font-medium"
				fill="currentColor"
				transform={`translate(0, ${headerOffset})`}
			>
				{weekDays.map((text, index) => (
					<text
						className="text-[12px]"
						dy={randomLabelOffset + index * cellSize}
						key={index}
					>
						{text}
					</text>
				))}
			</g>
		</svg>
	);
};
