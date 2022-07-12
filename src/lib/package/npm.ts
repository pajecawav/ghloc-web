export async function fetchNpmData(name: string): Promise<NpmData> {
	const res = await fetch(`https://api.npms.io/v2/package/${name}`);

	if (!res.ok) {
		throw new Error(`Failed to load npm data for '${name}'`);
	}

	const json = (await res.json()) as NpmsApiResponse;

	// NOTE: data can be outdated
	return {
		collectedAt: json.analyzedAt,
		version: json.collected.metadata.version,
		lastPublished: json.collected.metadata.date,
		dependencies: Object.keys(json.collected.metadata.dependencies ?? [])
			.length,
		downloadsLastWeek: json.collected.npm.downloads[1].count,
	};
}

export type NpmData = {
	collectedAt: string; // when data collected
	version: string;
	lastPublished: string;
	dependencies: number;
	downloadsLastWeek: number;
};

type NpmsApiResponse = {
	analyzedAt: string;
	collected: {
		metadata: {
			name: string;
			scope: string;
			version: string;
			description: string;
			keywords: string[];
			date: string;
			author: {
				name: string;
				email: string;
				username: string;
			};
			publisher: {
				username: string;
				email: string;
			};
			maintainers: {
				username: string;
				email: string;
			}[];
			repository: {
				type: string;
				url: string;
			};
			links: {
				npm: string;
				homepage: string;
				repository: string;
				bugs: string;
			};
			license: string;
			dependencies?: Record<string, string>;
			devDependencies: Record<string, string>;
			releases: {
				from: string;
				to: string;
				count: number;
			}[];
			hasTestScript: boolean;
			hasSelectiveFiles: boolean;
			readme: string;
		};
		npm: {
			downloads: {
				from: string;
				to: string;
				count: number;
			}[];
			starsCount: number;
		};
		github: unknown; // ignore
		source: {
			files: {
				readmeSize: number;
				testsSize: number;
			};
			linters: string[];
		};
	};
	evaluation: {
		quality: {
			carefulness: number;
			tests: number;
			health: number;
			branding: number;
		};
		popularity: {
			communityInterest: number;
			downloadsCount: number;
			downloadsAcceleration: number;
			dependentsCount: number;
		};
		maintenance: {
			releasesFrequency: number;
			commitsFrequency: number;
			openIssues: number;
			issuesDistribution: number;
		};
	};
	score: {
		final: number;
		detail: {
			quality: number;
			popularity: number;
			maintenance: number;
		};
	};
};
