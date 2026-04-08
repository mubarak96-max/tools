import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

export const revalidate = 1800;

export const metadata = buildMetadata({
  title: "Utility Tools for Text, Finance, and AI Workflows",
  description:
    "Browse practical utility tools for text cleanup, finance calculations, OCR, and lightweight AI workflows.",
  path: "/",
});

const MOST_USED_TOOL_HREFS = [
  "/text/image-to-text",
  "/text/ascii-art-generator",
  "/text/character-counter",
  "/text/case-converter",
  "/finance/salary-calculator",
  "/finance/mortgage-calculator",
];

const CATEGORY_ORDER = ["Text", "Finance", "AI"] as const;

const CATEGORY_ROUTES: Record<string, string> = {
  Text: "/text",
  Finance: "/finance",
  AI: "/ai",
};

function SectionHeader({
  title,
  href,
  ctaLabel,
}: {
  title: string;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {href && ctaLabel ? (
        <Link
          href={href}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ToolCard({
  name,
  href,
  description,
  category,
  icon,
}: {
  name: string;
  href: string;
  description: string;
  category: string;
  icon?: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card rounded-[1.5rem] border border-border/80 p-6 transition-colors hover:border-primary/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full border border-primary/10 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {category}
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{name}</h3>
        </div>
        {icon ? (
          <span className="rounded-[0.9rem] border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
    </Link>
  );
}

export default function Home() {
  const mostUsedTools = MOST_USED_TOOL_HREFS.map((href) => FREE_TOOLS.find((tool) => tool.href === href)).filter(
    (tool): tool is FreeToolMeta => Boolean(tool),
  );

  const groupedTools = FREE_TOOLS.reduce<Record<string, typeof FREE_TOOLS>>((groups, tool) => {
    groups[tool.category] = [...(groups[tool.category] || []), tool];
    return groups;
  }, {});

  const orderedCategories = CATEGORY_ORDER.map((category) => ({
    category,
    href: CATEGORY_ROUTES[category],
    tools: groupedTools[category] ?? [],
  })).filter((entry) => entry.tools.length > 0);

  return (
    <div className="space-y-12 pb-16">
      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <SectionHeader title="Most Used" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mostUsedTools.map((tool) => (
            <ToolCard
              key={tool.href}
              name={tool.name}
              href={tool.href}
              description={tool.description}
              category={tool.category}
              icon={tool.icon}
            />
          ))}
        </div>
      </section>

      {orderedCategories.map((entry) => {
        const visibleTools = entry.tools.slice(0, 4);
        const hasMore = entry.tools.length > 4;

        return (
          <section key={entry.category} className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
            <SectionHeader
              title={`${entry.category} Tools`}
              href={hasMore ? entry.href : undefined}
              ctaLabel={hasMore ? "Browse More" : undefined}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {visibleTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  name={tool.name}
                  href={tool.href}
                  description={tool.description}
                  category={tool.category}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
