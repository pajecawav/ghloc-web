import { useState } from "hono/jsx";
import { ghlocApi } from "~/lib/ghloc/api";
import { SpinnerIcon } from "~/components/icons/SpinnerIcon";

interface ExportReportProps {
	owner: string;
	repo: string;
	data?: any;
	defaultBranch?: string | null;
}

export default function ExportReport({ owner, repo, data, defaultBranch }: ExportReportProps) {
	const [loading, setLoading] = useState(false);

	const handleExport = async () => {
		setLoading(true);
		try {
			// Fetch LOC data
			let locs: any = null;
			try {
				const branchParam = defaultBranch || undefined;
				locs = await ghlocApi.getLocs({ owner, repo, branch: branchParam });
			} catch (e) {
				console.warn("Failed to fetch LOC data", e);
			}

			const lines: string[] = [];

			// Helper: Convert KB to MB
			const formatSize = (sizeKB: number): string => {
				if (!sizeKB) return "N/A";
				const sizeMB = sizeKB / 1000;
				return `${sizeMB.toFixed(2)} MB`;
			};

			// Header
			lines.push(`# ${owner}/${repo}`);
			lines.push("");
			lines.push(`Repository: https://github.com/${owner}/${repo}`);

			if (data?.description) {
				lines.push("");
				lines.push(data.description);
				lines.push("");
			}

			if (data?.topics && data.topics.length) {
				lines.push(`Topics: ${data.topics.join(", ")}`);
				lines.push("");
			}

			// Statistics
			lines.push("## Statistics");
			lines.push("");
			lines.push(`- **Stars:** ${data?.stargazers_count ?? "N/A"}`);
			lines.push(`- **Forks:** ${data?.forks ?? "N/A"}`);
			lines.push(`- **Watchers:** ${data?.subscribers_count ?? "N/A"}`);
			lines.push(`- **Open Issues:** ${data?.open_issues_count ?? "N/A"}`);
			lines.push(`- **Repository Size:** ${data?.size ? formatSize(data.size) : "N/A"}`);
			lines.push(`- **Default Branch:** ${data?.default_branch ?? "N/A"}`);

			if (data?.license) {
				lines.push(`- **License:** ${data.license.name}`);
			}
			if (data?.homepage) {
				lines.push(`- **Homepage:** ${data.homepage}`);
			}

			// Lines of Code
			lines.push("");
			lines.push("## Lines of Code");
			lines.push("");
			lines.push(`- **Total:** ${locs?.loc ?? "N/A"}`);

			if (locs?.locByLangs && Object.keys(locs.locByLangs).length) {
				lines.push("");
				lines.push("### Breakdown by Language");
				for (const [lang, count] of Object.entries(locs.locByLangs)) {
					lines.push(`- **${lang}:** ${count}`);
				}
			}

			// Footer
			lines.push("");
			lines.push(`---
*Report generated on ${new Date().toISOString()} by [ghloc-web](https://github.com/pajecawav/ghloc-web)*`);

			// Download
			const content = lines.join("\n");
			const blob = new Blob([content], { type: "text/markdown" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${owner}-${repo}-report.md`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);

			alert("Export completed");
		} catch (err) {
			console.error(err);
			alert("Export failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button
				class="border-border hover:border-border-focus flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
				onClick={handleExport}
				disabled={loading}
			>
				{loading ? <SpinnerIcon class="h-4 w-4 animate-spin" /> : "Export MD"}
			</button>
		</div>
	);
}
