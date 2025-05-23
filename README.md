# ghloc-web

![build status](https://github.com/pajecawav/ghloc-web/actions/workflows/ci.yml/badge.svg)
[![lines count](https://img.shields.io/endpoint?url=https://ghloc.vercel.app/api/pajecawav/ghloc-web/badge?filter=.ts$,.tsx$)](https://ghloc.vercel.app/pajecawav/ghloc-web?filter=.ts$,.tsx$)

A [website](https://ghloc.vercel.app/) to display GitHub repository info:

-   Total repo size
-   Repo health calculated by GitHub (`README.md`, license, etc)
-   Repo commit activity for the past year
-   Bundle size of an `npm` package
-   Total lines of code by file extension (provided by [ghloc](https://github.com/subtle-byte/ghloc))

[![Screenshot](https://user-images.githubusercontent.com/18193831/199794714-a4c7d8c1-17c3-4be9-8de4-dc0fb745ea2d.png)](https://ghloc.vercel.app/facebook/react)

## Addons

You can use a [user script](https://gist.github.com/pajecawav/70ffe72bf4aa0968aa9f97318976138f) to add a direct link to repo's ghloc page. Can be installed with [Tampermonkey](https://www.tampermonkey.net/).

Also [Firefox addon](https://addons.mozilla.org/ru/firefox/addon/github-lines-of-code/) is available. It provides LOCs stats dropdown directly on project's GitHub page and a direct link to repo's ghloc page. Source code available [here](https://github.com/pajecawav/ghloc-extension/).

## Badges

You can use [shields.io](https://shields.io) to embed badges into your README. Navigate to the
[endpoint badge docs](https://shields.io/badges/endpoint-badge) and enter the following to the `url`
field:

```
https://ghloc.vercel.app/api/OWNER/REPO/badge
```

Then you can preview your badge by clicking "Execute" and copy the full badge URL generated by shields.io which will look something like this:

```
https://img.shields.io/endpoint?url=https://ghloc.vercel.app/api/OWNER/REPO/badge
```

<p align="center">
    <img src="https://github.com/pajecawav/ghloc-web/assets/18193831/b5057889-9499-4296-88f3-fe0b40150cbf">
</p>

You can also optionally add an optional `filter` search param. For example the badge at the top of
this README has the following URL and only counts files with `.ts` or `.tsx` extension:

```
https://img.shields.io/endpoint?url=https://ghloc.vercel.app/api/pajecawav/ghloc-web/badge?filter=.ts$,.tsx$
```

To humanize LOC count you can add `format=human` to search params. So to a produce badge like [![lines
count](https://img.shields.io/endpoint?url=https://ghloc.vercel.app/api/pajecawav/ghloc-web/badge?format=human)](https://ghloc.vercel.app/pajecawav/ghloc-web)
you can use following URL:

```
https://img.shields.io/endpoint?url=https://ghloc.vercel.app/api/pajecawav/ghloc-web/badge?format=human
```

## Development

You can start a dev server by running following commands:

```bash
git clone https://github.com/pajecawav/ghloc-web.git
cd ghloc-web
pnpm install
pnpm dev
```

Then navigate to [http://localhost:3000](http://localhost:3000)
