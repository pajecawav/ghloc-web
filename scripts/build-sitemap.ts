import fs from "fs";
import path from "path";

const out = path.resolve(import.meta.dirname, "..", "public/sitemap.xml");

console.log(`Generating sitemap to ${out}`);

const data = fs.readFileSync(path.resolve(import.meta.dirname, "./repos.txt"), "utf8");
const repos = data
	.split("\n")
	.map(repo => repo.trim())
	.filter(Boolean);
const owners = [...new Set(repos.map(repo => repo.split("/")[0]))];

const buildEntry = (page: string) =>
	`\
<url>
    <loc>https://ghloc.dev/${page}</loc>
</url>`.trim();

const pages = [...repos, ...owners];

const sitemap = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages.map(page => buildEntry(page)).join("\n")}
</urlset>`.trim();

fs.writeFileSync(out, sitemap, "utf8");
