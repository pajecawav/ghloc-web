export type PackagephobiaData = {
	name: string;
	version: string;
	publish: {
		bytes: number;
		files: number;
		pretty: string;
		color: string;
	};
	install: {
		bytes: number;
		files: number;
		pretty: string;
		color: string;
	};
};

export async function fetchPackagephobiaData(name: string): Promise<PackagephobiaData> {
	const res = await fetch(`https://packagephobia.com/v2/api.json?p=${encodeURIComponent(name)}`);

	if (!res.ok) {
		throw new Error(`Failed to load package data for '${name}'`);
	}

	return res.json();
}
