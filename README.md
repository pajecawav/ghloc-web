# ghloc-web

![build status](https://github.com/pajecawav/ghloc-web/actions/workflows/ci.yml/badge.svg)

A [website](https://ghloc.vercel.app/) to display GitHub repository info:

-   Total repo size
-   Repo health calculated by GitHub (`README.md`, license, etc)
-   Repo commit activity for the past year
-   Bundle size of an `npm` package
-   Total lines of code by file extension

[![Screenshot](https://user-images.githubusercontent.com/18193831/199794714-a4c7d8c1-17c3-4be9-8de4-dc0fb745ea2d.png)](https://ghloc.vercel.app/facebook/react)

## Addons

You can use a [user script](https://gist.github.com/pajecawav/70ffe72bf4aa0968aa9f97318976138f) to add a direct link to repo's ghloc page. Can be installed with [Tampermonkey](https://www.tampermonkey.net/).

Also [Firefox addon](https://addons.mozilla.org/ru/firefox/addon/github-lines-of-code/) is available. It provides LOCs stats dropdown directly on project's GitHub page and a direct link to repo's ghloc page. Source code available [here](https://github.com/pajecawav/ghloc-extension/).
