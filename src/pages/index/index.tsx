import { Island } from "~/lib/island";
import IndexPageContent from "./components/IndexPageContent.island.lazy";

export const IndexPage = () => {
	return <Island Component={IndexPageContent} props={{}} />;
};
