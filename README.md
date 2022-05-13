# ghloc-web

![build status](https://github.com/pajecawav/ghloc-web/actions/workflows/build.yml/badge.svg)

A [website](https://ghloc.vercel.app/) to display GitHub repository info. The following information is available:

-   Total repo size
-   Repo health calculated by GitHub (`README.md`, license, etc)
-   Repo commit activity for the past year
-   Bundle size of an `npm` package
-   Total lines of code in files by file extension. Supports navigation, preview of text files and files filtering. LOCs data is provided by [ghloc](https://github.com/subtle-byte/ghloc).

[![Screenshot](https://user-images.githubusercontent.com/18193831/166311168-72751a16-e8a4-4b3d-94ad-c37993d9e7bd.png)](https://ghloc.vercel.app/facebook/react)

## Addons

You can use a [user script](https://gist.github.com/pajecawav/70ffe72bf4aa0968aa9f97318976138f) to add a direct link to repo's ghloc page. Can be installed with [Tampermonkey](https://www.tampermonkey.net/).

Also [Firefox addon](https://addons.mozilla.org/ru/firefox/addon/github-lines-of-code/) is available. It provides LOCs stats dropdown directly on project's GitHub page and a direct link to repo's ghloc page. Source code available [here](https://github.com/pajecawav/ghloc-extension/).

## Development

1. Clone the repository: `git clone https://github.com/pajecawav/ghloc-web`.
1. Install dependencies: `yarn install`.
1. Start development server: `yarn dev`.
1. Navigate to `localhost:3000`.

To build the project run `yarn build`.
