import { ImageResponse } from "@vercel/og";
import { GitHubIcon } from "~/components/icons/GitHubIcon";
import { formatNumber } from "~/lib/format";
import { Locs, ghlocApi } from "~/lib/ghloc/api";
import { ghApi } from "~/lib/github/api";
import { getLanguageFromExtension } from "~/lib/languages";

const colors = {
	text: "#e5e7eb",
	bg: "#181a1b",
	border: "#2f3335",
	highlight: "#2f3335",
};

export default defineEventHandler(async event => {
	const { owner, repo } = getRouterParams(event);
	// eslint-disable-next-line prefer-const
	let { branch, filter } = getQuery<{
		branch?: string;
		filter?: string;
		format?: string;
	}>(event);

	let locs: Locs;
	try {
		if (!branch) {
			branch = (await ghApi.getRepo(owner, repo)).default_branch;
		}

		locs = await ghlocApi.getLocs({ owner, repo, branch, filter });
	} catch (e) {
		console.error("Failed to fetch locs", e);
		throw createError({ statusCode: 500, statusMessage: "Failed to fetch locs" });
	}

	const totalLocs = locs.loc;
	const topLangs = Object.entries(locs.locByLangs ?? {}).slice(0, 6);

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 64,
					background: colors.bg,
					color: colors.text,
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
				}}
			>
				<Header owner={owner} repo={repo} />

				<div style={{ display: "flex", flex: 1 }}>
					<TotalLocs totalLocs={totalLocs} />
					<LangsList topLangs={topLangs} totalLocs={totalLocs} />
				</div>
			</div>
		),
		{
			headers: {
				// override default cache
				"cache-control": "public, no-transform, max-age=900",
			},
		},
	);
});

function Header({ owner, repo }: { owner: string; repo: string }) {
	return (
		<div
			style={{
				flex: 0.3,
				display: "flex",
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				borderBottom: `1px solid ${colors.border}`,
			}}
		>
			<GitHubIcon
				fill={colors.text}
				style={{
					width: "1.25em",
					height: "1.25em",
					marginRight: "10px",
				}}
			/>
			{owner}/{repo}
		</div>
	);
}

function TotalLocs({ totalLocs }: { totalLocs: number }) {
	const formatted = formatNumber(totalLocs);
	const length = formatted.length;

	return (
		<div
			style={{
				width: 0,
				flex: 1,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				borderRight: `1px solid ${colors.border}`,
			}}
		>
			<span
				style={{
					fontSize: 128 - 8 * Math.max(length - 8, 0),
				}}
			>
				{formatted}
			</span>
			<span>lines</span>
		</div>
	);
}

function LangsList({
	topLangs,
	totalLocs,
}: {
	topLangs: [lang: string, loc: number][];
	totalLocs: number;
}) {
	return (
		<div
			style={{
				width: 0,
				height: "100%",
				flex: 1,
				fontSize: 36,
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				justifyContent: "center",
			}}
		>
			{topLangs.map(([lang, loc], index) => (
				<LangsListEntry
					lang={lang}
					loc={loc}
					percentage={(loc / totalLocs) * 100}
					index={index}
					key={lang}
				/>
			))}
		</div>
	);
}

function LangsListEntry({
	lang,
	loc,
	percentage,
	index,
}: {
	lang: string;
	loc: number;
	percentage: number;
	index: number;
}) {
	return (
		<div
			style={{
				display: "flex",
				margin: "0 16px",
				backgroundImage: `linear-gradient(to right, ${colors.highlight}, ${colors.highlight})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: `${percentage}% 100%`,
				marginTop: index > 0 ? "12px" : 0,
			}}
		>
			<div
				style={{
					flex: 1,
					margin: "0 12px",
					display: "flex",
				}}
			>
				<div
					style={{
						flex: 1,
						display: "flex",
					}}
				>
					<div
						style={{
							width: "100%",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							overflow: "hidden",
						}}
					>
						{getLanguageFromExtension(lang) ?? lang}
					</div>
				</div>
				<div
					style={{
						flexShrink: 0,
						marginLeft: "auto",
						whiteSpace: "nowrap",
					}}
				>
					{`${formatNumber(loc)} (${percentage.toFixed(1)}%)`}
				</div>
			</div>
		</div>
	);
}
