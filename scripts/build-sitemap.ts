import fs from "fs";
import path from "path";

const out = path.resolve(import.meta.dirname, "..", "public/sitemap.xml");

console.log(`Generating sitemap to ${out}`);

const data = fs.readFileSync(path.resolve(import.meta.dirname, "./repos.txt"), "utf8");
const repos = data.trim().split("\n");

const buildEntry = (repo: string) =>
	`\
<url>
    <loc>https://ghloc.vercel.app/${repo}</loc>
</url>`.trim();

const sitemap = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    ${repos.map(repo => buildEntry(repo)).join("\n")}
</urlset>`.trim();

fs.writeFileSync(out, sitemap, "utf8");
