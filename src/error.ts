import { defineErrorHandler } from "nitro";
import type { NitroErrorHandler } from "nitro/types";

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const errorHandler: NitroErrorHandler = defineErrorHandler(error => {
	console.error(error);

	const status = error.statusCode ?? 500;
	const message = error.statusMessage ?? "Something went wrong";

	// error pages must not be indexed
	return new Response(
		`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${status} | ghloc</title>
</head>
<body style="font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; gap: 0.5rem; background: #181a1b; color: #e5e7eb;">
<h1 style="margin: 0;">${status}</h1>
<p style="margin: 0;">${escapeHtml(message)}</p>
<a href="/" style="color: #3b82f6;">ghloc</a>
</body>
</html>`,
		{
			status,
			headers: { "content-type": "text/html; charset=utf-8" },
		},
	);
});

export default errorHandler;
