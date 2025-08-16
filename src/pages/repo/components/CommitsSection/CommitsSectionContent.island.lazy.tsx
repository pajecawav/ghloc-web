import dayjs from "dayjs";
import { memo } from "hono/jsx";
import { ErrorPlaceholder } from "~/components/ErrorPlaceholder";
import { Heading } from "~/components/Heading";
import { Skeleton } from "~/components/Skeleton";
import { ghApi, GHApiGetCommitActivityResponse } from "~/lib/github/api";
import { useQuery } from "~/lib/query/useQuery";
import { cn } from "~/lib/utils";
import { Section } from "~/pages/repo/components/Section";
import { CommonSectionProps } from "~/pages/repo/types";

const DAY_IN_SECONDS = 60 * 60 * 24;

interface CommitsSectionContentProps extends CommonSectionProps {
	activity: GHApiGetCommitActivityResponse | undefined;
}

export default function CommitsSectionContent({
	owner,
	repo,
	activity: initialData,
}: CommitsSectionContentProps) {
	const query = useQuery({
		queryKey: ["activity", owner, repo],
		queryFn: () => ghApi.getCommitActivity(owner, repo),
		initialData,
	});

	if (query.status === "error") {
		return (
			<Section title="Commits">
				<ErrorPlaceholder>Failed to load commit activity</ErrorPlaceholder>
			</Section>
		);
	}

	if (query.status === "pending" || !query.data) {
		return (
			<div>
				<Heading>Commits</Heading>
				<Skeleton class="h-36" />
			</div>
		);
	}

	const activity = query.data;

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
		<div class="border-border grid h-36 place-items-center overflow-x-auto rounded-md border p-4">
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
										{`${value} commits on ${dayjs(
											(week.week + dayIndex * DAY_IN_SECONDS) * 1000,
										).format("MMM D, YYYY")}`}
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
						const date = dayjs(week.week * 1000);
						const dateEnd = date.add(1, "week");

						if (date.isSame(dateEnd, "month")) {
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
								{dateEnd.format("MMM")}
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
