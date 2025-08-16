const DEFAULT_TITLE = "Count lines of code";

export const buildPageTitle = (title?: string) => `${title ?? DEFAULT_TITLE} | ghloc`;
