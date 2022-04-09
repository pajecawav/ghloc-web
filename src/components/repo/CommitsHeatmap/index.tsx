import { CommitActivity } from "@/lib/github";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { memo } from "react";
import styles from "./CommitsHeatmap.module.css";

const DAY = 60 * 60 * 24;

type Props = {
	data: CommitActivity;
};

export const CommitsHeatmap = memo(({ data }: Props) => {
	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const cellSize = 16;
	const headerOffset = 17;
	const weekDaysOffset = 35;
	const randomLabelOffset = 10; // idk what this is

	const commitsLevelColors = {
		0: "text-bg-accent",
		1: "text-heat-level1",
		2: "text-heat-level2",
		3: "text-heat-level3",
		4: "text-heat-level4",
	} as Record<number, string>;
	const getSquareColor = (value: number) => {
		const level = value ? Math.min(Math.floor(value / 5) + 1, 4) : 0;
		return commitsLevelColors[level];
	};

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 863 128">
			<g
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
									getSquareColor(value)
								)}
								width="11"
								height="11"
								rx="2"
								ry="2"
								y={dayIndex * cellSize}
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
				className="text-muted font-medium"
				fill="currentColor"
				transform={`translate(${weekDaysOffset}, 0)`}
			>
				{data.map((week, index) => {
					const date = dayjs(week.week * 1000);
					const dateEnd = date.add(1, "week");

					if (date.isSame(dateEnd, "month")) return null;

					// do not show the label if it's the last column
					if (index + 1 === data.length) return null;

					return (
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
				className="text-muted font-medium"
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
});

CommitsHeatmap.displayName = "CommitsHeatmap";
