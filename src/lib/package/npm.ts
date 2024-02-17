export async function fetchNpmData(name: string): Promise<NpmData> {
	const res = await fetch(
		`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`,
	);

	if (!res.ok) {
		throw new Error(`Failed to load npm downloads data for '${name}'`);
	}

	const json = (await res.json()) as NpmApiResponse;

	return { downloadsLastWeek: json.downloads };
}

export type NpmData = {
	downloadsLastWeek: number;
};

type NpmApiResponse = {
	pacakge: string;
	downloads: number;
	start: string;
	end: string;
};
