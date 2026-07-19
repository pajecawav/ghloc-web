import { definePage } from "@pajecawav/yamf";
import IndexPageContent from "~/components/index-page/IndexPageContent.island";

export default definePage({
	render: () => {
		// IndexPageContent is a full-page island; URL is available via useRouter on the client.
		return <IndexPageContent />;
	},
});
