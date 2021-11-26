# Repo Stats

![build](https://github.com/pajecawav/repo-stats/actions/workflows/build.yml/badge.svg)

Display GitHub repository stats. Currently the following information is available:

-   Total repo size
-   Repo health calculated by GitHub (`README.md`, license, etc)
-   Repo commit activity for the past year
-   Total lines of code in files by file extension. Supports navigation, preview of text files and files filtering. LOCs data is provided by [ghloc](https://github.com/subtle-byte/ghloc).

![Screenshot of the site](./assets/screenshot.png)

## Current Limitations

-   GitHub API has a limit of 60 unathorized requests per hour. This should be enough for most use cases but a simple GitHub OAuth with no scopes can be implemented later to increase the limit to 5000 requests per hour.
-   LOCs API has a max repo size limit.

## Development

1. Clone the repository: `git clone https://github.com/pajecawav/repo-stats`.
1. Install dependencies: `yarn install`.
1. Start development server: `yarn dev`.
1. Navigate to `localhost:3000`.

To build the project run `yarn build`.
