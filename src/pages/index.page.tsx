import { definePage } from "@pajecawav/yamf";
import IndexPageContent from "./components/IndexPageContent.island";
import { getRandomRepo } from "./components/randomRepos";

export default definePage({
	render: () => {
		// IndexPageContent is a full-page island; URL is available via useRouter on the client.
		return <IndexPageContent placeholder={getRandomRepo()} />;
	},
});
