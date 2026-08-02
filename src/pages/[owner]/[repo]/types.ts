import { GHApiGetRepoResponse } from "~/lib/github/api";

export interface CommonSectionProps {
	owner: string;
	repo: string;
	data: GHApiGetRepoResponse | null;
}
