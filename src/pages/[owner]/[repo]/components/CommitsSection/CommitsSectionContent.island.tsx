import { IslandProps } from "@pajecawav/yamf";
import { memo } from "hono/jsx";
import useSWRImmutable from "swr/immutable";
import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { Heading } from "~/components/Heading";
import { Skeleton } from "~/components/Skeleton";
import { formatDate, formatMonth } from "~/lib/format";
import { ghApi, type GHApiGetCommitActivityResponse } from "~/lib/github/api";
import { cn } from "~/lib/utils";
import type { CommonSectionProps } from "../../types";
import { Section } from "../Section";

const DAY_IN_SECONDS = 60 * 60 * 24;

interface CommitsSectionContentProps extends CommonSectionProps, IslandProps {
	activity: GHApiGetCommitActivityResponse | null | undefined;
}

export default function CommitsSectionContent({
	owner,
	repo,
	activity: initialData,
}: CommitsSectionContentProps) {
	const { data: activity, error } = useSWRImmutable<GHApiGetCommitActivityResponse | null>(
		["activity", owner, repo],
		() => ghApi.getCommitActivity(owner, repo),
		{ fallbackData: initialData ?? undefined },
	);

	if (error) {
		return (
			<Section title="Commits">
				<ErrorPlaceholder>Failed to load commit activity</ErrorPlaceholder>
			</Section>
		);
	}

	if (!activity) {
		return (
			<div>
				<Heading>Commits</Heading>
				<Skeleton class="h-36" />
			</div>
		);
	}

	const totalCommits = activity.reduce((total, entry) => total + entry.total, 0);

	return (
		<div>
			<Heading>Commits ({totalCommits} last year)</Heading>
			<Heatmap activity={activity} />
		</div>
	);
}

const Heatmap = memo(({ activity }: { activity: GHApiGetCommitActivityResponse }) => {
	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const cellSize = 16;
	const headerOffset = 17;
	const weekDaysOffset = 35;
	const randomLabelOffset = 10; // idk what this is

	const maxLevel = 4;

	const valueToLevel = (value: number) =>
		value ? Math.min(Math.floor(value / 5) + 1, maxLevel) : 0;

	const levelToClass: Record<number, string> = {
		0: "text-neutral-100 dark:text-neutral-800",
		1: "text-green-300 dark:text-green-900",
		2: "text-green-500 dark:text-green-700",
		3: "text-green-700 dark:text-green-500",
		4: "text-green-900 dark:text-green-300",
	};

	return (
		<div class="grid h-36 place-items-center overflow-x-auto rounded-md border border-border p-4">
			<svg class="min-w-[700px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 863 128">
				<g fill="currentColor" transform={`translate(${weekDaysOffset}, ${headerOffset})`}>
					{activity.map((week, weekIndex) => (
						<g transform={`translate(${weekIndex * cellSize}, 0)`} key={week.week}>
							{week.days.map((value, dayIndex) => (
								<rect
									key={dayIndex}
									class={cn(
										"outline -outline-offset-1 outline-[#6b728010]",
										levelToClass[valueToLevel(value)],
									)}
									width="11"
									height="11"
									rx="2"
									ry="2"
									y={dayIndex * cellSize}
								>
									<title>
										{`${value} commits on ${formatDate(
											new Date(
												(week.week + dayIndex * DAY_IN_SECONDS) * 1000,
											),
										)}`}
									</title>
								</rect>
							))}
						</g>
					))}
				</g>

				<g
					class="font-medium text-neutral-500 dark:text-neutral-300"
					fill="currentColor"
					transform={`translate(${weekDaysOffset}, 0)`}
				>
					{activity.map((week, index) => {
						const date = new Date(week.week * 1000);
						const dateEnd = new Date(date.getTime() + 7 * DAY_IN_SECONDS * 1000);

						if (
							date.getMonth() === dateEnd.getMonth() &&
							date.getFullYear() === dateEnd.getFullYear()
						) {
							return null;
						}

						// do not show the label if it's the last column
						if (index + 1 >= activity.length) {
							return null;
						}

						return (
							<text
								class="text-[12px]"
								dy={randomLabelOffset}
								dx={index * cellSize}
								key={index}
							>
								{formatMonth(dateEnd)}
							</text>
						);
					})}
				</g>

				<g
					class="font-medium text-neutral-500 dark:text-neutral-300"
					fill="currentColor"
					transform={`translate(0, ${headerOffset})`}
				>
					{weekDays.map((text, index) => (
						<text
							class="text-[12px]"
							dy={randomLabelOffset + index * cellSize}
							key={index}
						>
							{text}
						</text>
					))}
				</g>
			</svg>
		</div>
	);
});
