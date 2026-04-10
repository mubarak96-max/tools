export interface RobotsTxtInput {
  userAgent: string;
  allowRules: string[];
  disallowRules: string[];
  sitemapUrl: string;
  crawlDelay: string;
}

export function generateRobotsTxt(input: RobotsTxtInput) {
  const lines: string[] = [];
  const userAgent = input.userAgent.trim() || "*";

  lines.push(`User-agent: ${userAgent}`);

  input.allowRules
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      lines.push(`Allow: ${value}`);
    });

  input.disallowRules
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      lines.push(`Disallow: ${value}`);
    });

  if (input.crawlDelay.trim()) {
    lines.push(`Crawl-delay: ${input.crawlDelay.trim()}`);
  }

  if (input.sitemapUrl.trim()) {
    lines.push("");
    lines.push(`Sitemap: ${input.sitemapUrl.trim()}`);
  }

  return lines.join("\n");
}
