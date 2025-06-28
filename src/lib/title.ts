const DEFAULT_TITLE = "ghloc | Count lines of code";

export const buildPageTitle = (title?: string) => (title ? `${title} | ghloc` : DEFAULT_TITLE);
