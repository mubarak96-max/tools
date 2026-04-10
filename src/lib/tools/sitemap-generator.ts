export interface SitemapGeneratorInput {
  siteUrl: string;
  entries: string[];
  changefreq: string;
  priority: string;
  includeLastmod: boolean;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateSitemapXml(input: SitemapGeneratorInput) {
  const siteUrl = input.siteUrl.trim().replace(/\/+$/, "");
  const today = new Date().toISOString().slice(0, 10);
  const urls = input.entries
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      if (/^https?:\/\//i.test(entry)) {
        return entry;
      }

      const normalizedPath = entry.startsWith("/") ? entry : `/${entry}`;
      return `${siteUrl}${normalizedPath}`;
    });

  const body = urls
    .map((url) => {
      const lines = [
        "  <url>",
        `    <loc>${escapeXml(url)}</loc>`,
      ];

      if (input.includeLastmod) {
        lines.push(`    <lastmod>${today}</lastmod>`);
      }

      if (input.changefreq.trim()) {
        lines.push(`    <changefreq>${escapeXml(input.changefreq.trim())}</changefreq>`);
      }

      if (input.priority.trim()) {
        lines.push(`    <priority>${escapeXml(input.priority.trim())}</priority>`);
      }

      lines.push("  </url>");
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
