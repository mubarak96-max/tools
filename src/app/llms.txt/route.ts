import { ALL_HUBS } from "@/lib/hubs";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/metadata";
import { ALL_TOOLS } from "@/lib/tools-data";

export const revalidate = 86400;

const TOOLS_BY_HREF = new Map(ALL_TOOLS.map((tool) => [tool.href, tool]));

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    "> Free calculators and browser-based tools for salary and income tax, end-of-service pay, stamp duty and property tax, loans, investing, online seller fees, text editing, SEO and social media. Calculators explain their formulas, and most tools run entirely in the browser.",
    "",
    `Built and maintained by Mubarak Mutesasira. About: ${absoluteUrl("/about")}`,
    "",
  ];

  for (const hub of ALL_HUBS) {
    lines.push(`## ${hub.label}`, "", `${hub.metaDescription} Overview: ${absoluteUrl(hub.path)}`, "");
    const seen = new Set<string>();
    for (const group of hub.groups) {
      for (const href of group.hrefs) {
        const tool = TOOLS_BY_HREF.get(href);
        if (!tool || seen.has(href)) continue;
        seen.add(href);
        lines.push(`- [${tool.name}](${absoluteUrl(href)}): ${tool.description}`);
      }
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
