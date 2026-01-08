import { memo, useEffect, useState } from "hono/jsx";
import { highlightCode } from "~/lib/highlight";
import styles from "./CodePreview.module.css";

interface CodePreviewProps {
	code: string;
	lang: string | null | undefined;
}

export const CodePreview = memo(({ code, lang }: CodePreviewProps) => {
	const [html, setHtml] = useState<string | null>(null);

	useEffect(() => {
		setHtml(null);

		const ac = new AbortController();

		highlightCode(code.trimEnd(), lang).then(html => {
			if (html !== null && !ac.signal.aborted) {
				setHtml(html);
			}
		});

		return () => {
			ac.abort();
		};
	}, [code, lang]);

	if (!html) {
		return (
			<div className={styles.preview}>
				{code
					.trimEnd()
					.split("\n")
					.map((line, index) => (
						<pre class="line pr-3" key={index}>
							{line}
						</pre>
					))}
			</div>
		);
	}

	return (
		<div className={styles.preview}>
			{html.split("\n").map((line, index) => (
				<pre class="line pr-3" key={index} dangerouslySetInnerHTML={{ __html: line }} />
			))}
		</div>
	);
});
