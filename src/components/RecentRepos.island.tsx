import { useEffect, useState } from "hono/jsx";

const STORAGE_KEY = "recentRepos";
const MAX_ITEMS = 8;

const readList = () => {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const list = raw ? JSON.parse(raw) : [];
		return list.slice(0, MAX_ITEMS);
	} catch {
		return [];
	}
};

export default function RecentRepos() {
	const [list, setList] = useState(() => readList());

	useEffect(() => {
		const onUpdate = () => setList(readList());

		window.addEventListener("recent-repos-updated", onUpdate);
		window.addEventListener("storage", onUpdate);

		return () => {
			window.removeEventListener("recent-repos-updated", onUpdate);
			window.removeEventListener("storage", onUpdate);
		};
	}, []);

	if (!list || list.length === 0) return null;

	const clearAll = () => {
		localStorage.removeItem(STORAGE_KEY);
		setList([]);
		window.dispatchEvent(new Event("recent-repos-updated"));
	};

	return (
		<aside class="border-border bg-surface w-64 rounded-md border p-2 text-sm">
			<div class="mb-2 flex items-center justify-between">
				<div class="font-medium">Recent Repos</div>
				<button
					class="text-muted text-xs hover:underline"
					onClick={clearAll}
					title="Clear recent repos"
				>
					Clear
				</button>
			</div>

			<ul class="flex flex-col gap-1">
				{list.map((item: any) => (
					<li key={item.id} class="hover:bg-muted rounded">
						<a
							class="block px-2 py-1"
							href={`/${item.owner}/${item.repo}${item.defaultBranch ? `?branch=${encodeURIComponent(item.defaultBranch)}` : ""}`}
						>
							<div class="truncate">
								{item.owner}/{item.repo}
							</div>
							<div class="text-muted text-xs">
								{new Date(item.ts).toLocaleString()}
							</div>
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
