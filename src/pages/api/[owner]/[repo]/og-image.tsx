import { GithubIcon } from "@/components/icons/GithubIcon";
import { getLanguageFromExtension } from "@/languages";
import { formatNumber } from "@/lib/format";
import { Locs } from "@/types";
import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { $fetch } from "ohmyfetch";

export const config = {
	runtime: "edge",
};

const DEBUG = false;

const colors = {
	text: "#e5e7eb",
	bg: "#181a1b",
	border: "#2f3335",
	highlight: "#2f3335",
};

function getDebugBorder(color: string): string {
	return DEBUG ? `1px solid ${color}` : "none";
}

function renderLoc(loc: number, total: number): string {
	return `${formatNumber(loc)} (${((100 * loc) / total).toFixed(1)}%)`;
}

export default async function handler(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const owner = searchParams.get("owner")!;
	const repo = searchParams.get("repo")!;
	const branch = searchParams.get("branch");

	let url = `https://ghloc.ifels.dev/${owner}/${repo}`;
	if (branch) {
		url += `/${branch}`;
	}

	let locs: Locs;
	try {
		locs = await $fetch<Locs>(`${url}?pretty=false`);
	} catch {
		return new Response("Internal Server Error", {
			status: 500,
		});
	}

	const totalLocs = locs.loc;
	const topLangs = Object.entries(locs.locByLangs).slice(0, 6);

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
		}
	);
}

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
			<GithubIcon
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
	topLangs: [string, number][];
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
					totalLocs={totalLocs}
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
	totalLocs,
	index,
}: {
	lang: string;
	loc: number;
	totalLocs: number;
	index: number;
}) {
	return (
		<div
			style={{
				display: "flex",
				margin: "0 16px",
				backgroundImage: `linear-gradient(to right, ${colors.highlight}, ${colors.highlight})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: `${(loc / totalLocs) * 100}% 100%`,
				marginTop: index > 0 ? "12px" : 0,
				border: getDebugBorder("orange"),
			}}
		>
			<div
				style={{
					flex: 1,
					margin: "0 12px",
					display: "flex",
					border: getDebugBorder("red"),
				}}
			>
				<div
					style={{
						flex: 1,
						display: "flex",
						border: getDebugBorder("blue"),
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
						border: getDebugBorder("green"),
					}}
				>
					{renderLoc(loc, totalLocs)}
				</div>
			</div>
		</div>
	);
}
