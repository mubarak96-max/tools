import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 14400;

export const metadata = buildMetadata({
  title: "Sitemap for Utility Tools",
  description:
    "Browse utility tools from one HTML sitemap.",
  path: "/sitemap",
});

export default async function SitemapPage() {
  const utilityGroups = FREE_TOOLS.reduce<Record<string, typeof FREE_TOOLS>>((groups, tool) => {
    groups[tool.category] = [...(groups[tool.category] || []), tool];
    return groups;
  }, {});

  const utilityCategories = Object.entries(utilityGroups).sort(([left], [right]) => left.localeCompare(right));

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          HTML sitemap
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Browse tools
        </h1>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Utility categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Utility tools by category
            </h2>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            {FREE_TOOLS.length} tools
          </span>
        </div>

        <div className="mt-6 space-y-6">
          {utilityCategories.map(([category, tools]) => (
            <section key={category} className="rounded-[1.25rem] border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category === "Finance"
                      ? "Calculators and finance-focused utility tools."
                      : category === "Text"
                        ? "Text cleanup, transformation, and analysis tools."
                        : "Focused utility tools in this category."}
                  </p>
                </div>
                <Link
                  href={`/${category.toLowerCase()}`}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  View {category}
                </Link>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="rounded-[1rem] border border-border bg-card px-4 py-4 text-sm transition-colors hover:border-primary/20 hover:bg-primary-soft"
                  >
                    <div className="font-semibold text-foreground">{tool.name}</div>
                    <div className="mt-2 leading-6 text-muted-foreground">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
