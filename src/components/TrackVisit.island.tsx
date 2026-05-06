import { useEffect } from "hono/jsx";

interface TrackVisitProps {
	owner: string;
	repo: string;
	defaultBranch?: string | null;
}

const MAX_ITEMS = 8;

const pushRecentRepo = (owner: string, repo: string, defaultBranch?: string | null) => {
	try {
		const key = "recentRepos";
		const raw = localStorage.getItem(key);
		let list: Array<any> = raw ? JSON.parse(raw) : [];

		const id = `${owner}/${repo}`;

		list = list.filter(item => item.id !== id);

		list.unshift({ id, owner, repo, defaultBranch: defaultBranch ?? null, ts: Date.now() });

		if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);

		localStorage.setItem(key, JSON.stringify(list));

		// notify other islands in the same tab
		try {
			window.dispatchEvent(new Event("recent-repos-updated"));
		} catch {
			// ignore
		}
	} catch {
		// ignore
	}
};

export default function TrackVisit({ owner, repo, defaultBranch }: TrackVisitProps) {
	useEffect(() => {
		if (!owner || !repo) return;

		pushRecentRepo(owner, repo, defaultBranch);
	}, [owner, repo, defaultBranch]);

	return null;
}
