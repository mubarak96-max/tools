import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { getFeaturedTools, listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { buildMetadata } from "@/lib/seo/metadata";
import { comparisonSlug, slugify } from "@/lib/slug";
import { FREE_TOOLS } from "@/lib/tools/registry";
import { getPricingTone } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/database";

export const revalidate = 1800;

export const metadata = buildMetadata({
  title: "Find Software With Structure",
  description:
    "Search, compare, and shortlist software tools with structured facts, editorial context, and stronger discovery paths.",
  path: "/",
});

type ComparisonHighlight = {
  slug: string;
  label: string;
  summary: string;
};

type HomePageData = {
  featuredTools: Tool[];
  allTools: Tool[];
  popularCategories: Array<{ label: string; count: number }>;
  comparisonHighlights: ComparisonHighlight[];
  useCaseLinks: string[];
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function getHomePageData(): Promise<HomePageData> {
  const [featuredTools, allTools] = await Promise.all([
    getFeaturedTools(3),
    listTools({ status: ["published"] }),
  ]);

  const categoryMap = new Map<string, number>();
  const useCaseMap = new Map<string, number>();

  for (const tool of allTools) {
    for (const category of tool.categories?.length ? tool.categories : [tool.category]) {
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
    }

    for (const useCase of tool.useCases) {
      useCaseMap.set(useCase, (useCaseMap.get(useCase) ?? 0) + 1);
    }
  }

  const popularCategories = [...categoryMap.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 4)
    .map(([label, count]) => ({
      label,
      count,
    }));

  const comparisonHighlights = allTools
    .flatMap((tool, index) =>
      allTools.slice(index + 1).map((candidate) => ({
        left: tool,
        right: candidate,
        score: scoreComparisonPair(tool, candidate),
      })),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ left, right }) => ({
      slug: comparisonSlug(left.slug, right.slug),
      label: `${left.name} vs ${right.name}`,
      summary:
        left.aiInsights?.comparisonSummary ||
        right.aiInsights?.comparisonSummary ||
        `Compare ${left.name} and ${right.name} across setup, pricing, and workflow fit.`,
    }));

  const useCaseLinks = [...useCaseMap.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 10)
    .map(([label]) => label);

  return {
    featuredTools,
    allTools,
    popularCategories,
    comparisonHighlights,
    useCaseLinks,
  };
}

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
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {href && ctaLabel ? (
        <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default async function Home() {
  const { featuredTools, allTools, popularCategories, comparisonHighlights, useCaseLinks } =
    await getHomePageData();

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8">
        <div className="inline-flex rounded-full border border-primary/15 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {allTools.length}+ tools indexed
        </div>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Find the right tool.
          <br />
          Skip the wrong trial.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Structured software discovery with real pricing, comparisons, and alternatives instead of another generic list.
        </p>

        <form
          action="/tools"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-[1.5rem] border border-border bg-card px-4 py-4 shadow-[0_24px_54px_-42px_rgba(15,23,42,0.16)] sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-3 rounded-[1rem] bg-background px-3 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              name="q"
              placeholder="Search tools, use cases, or categories..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            className="rounded-[1rem] border border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { label: "AI writing", query: "AI writing" },
            { label: "Project management", query: "Project management" },
            { label: "Design", query: "Design" },
            { label: "For freelancers", query: "freelancers" },
            { label: "Free tools", query: "" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.label === "Free tools" ? "/free-tools" : `/tools?q=${encodeURIComponent(item.query)}`}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-border/80" />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader title="Free utility spotlight" href="/free-tools" ctaLabel="Browse free tools →" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Link
            href={FREE_TOOLS[0]?.href || "/free-tools"}
            className="glass-card rounded-[1.75rem] border border-border/80 p-6 transition-colors hover:border-primary/20"
          >
            <div className="inline-flex rounded-full border border-primary/10 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Finance
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {FREE_TOOLS[0]?.name || "EMI Calculator"}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {FREE_TOOLS[0]?.description ||
                "Calculate monthly loan repayments with instant amortization breakdowns and multi-currency defaults."}
            </p>
          </Link>

          <Link
            href="/free-tools"
            className="glass-card rounded-[1.75rem] border border-border/80 p-6 transition-colors hover:border-primary/20"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Free tools hub
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {FREE_TOOLS.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lightweight calculators and utilities built for fast search intent.
            </p>
          </Link>
        </div>
      </section>

      <div className="border-t border-border/80" />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader title="Browse by category" href="/tools" ctaLabel="View all →" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {popularCategories.map((category, index) => {
            const toneClasses = [
              "bg-primary-soft text-primary",
              "bg-warning-soft text-warning-soft-foreground",
              "bg-success-soft text-success-soft-foreground",
              "bg-danger-soft text-danger-soft-foreground",
            ];

            return (
              <Link
                key={category.label}
                href={`/best/${slugify(category.label)}`}
                className="block rounded-[1.5rem] border border-border bg-card p-5 transition-colors hover:border-primary/20"
              >
                <div
                  className={cn(
                    "mb-4 flex h-10 w-10 items-center justify-center rounded-[0.9rem] text-sm font-semibold",
                    toneClasses[index % toneClasses.length],
                  )}
                >
                  {getInitials(category.label)}
                </div>
                <h3 className="text-base font-semibold text-foreground">{category.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{category.count} tools reviewed</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="border-t border-border/80" />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader title="Editorial picks" href="/tools" ctaLabel="Browse all tools →" />
        {featuredTools.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="block rounded-[1.5rem] border border-border bg-card p-5 transition-colors hover:border-primary/20"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-primary-soft text-sm font-semibold text-primary">
                      {getInitials(tool.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{tool.category}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      getPricingTone(tool.pricingModel, tool.pricing),
                    )}
                  >
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {tool.shortDescription || tool.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.useCases.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-border bg-card p-8 text-sm text-muted-foreground">
            No tools are published yet.
          </div>
        )}
      </section>

      <div className="border-t border-border/80" />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          title="Popular comparisons"
          href={comparisonHighlights[0] ? "/tools?q=compare" : undefined}
          ctaLabel={comparisonHighlights[0] ? "Explore comparisons →" : undefined}
        />
        <div className="grid gap-3 lg:grid-cols-3">
          {comparisonHighlights.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="flex items-center gap-3 rounded-[1.5rem] border border-border bg-card p-5 transition-colors hover:border-primary/20"
            >
              <span className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                VS
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground">{comparison.label}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{comparison.summary}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-border/80" />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader title="Browse by use case" />
        <div className="flex flex-wrap gap-2">
          {useCaseLinks.map((useCase) => (
            <Link
              key={useCase}
              href={`/tools-for-${slugify(useCase)}`}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-muted hover:text-foreground"
            >
              {useCase}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border/80 bg-muted/60 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Not sure where to start?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Describe what you are trying to do and jump straight into a structured shortlist.
          </p>
          <Link
            href="/tools"
            className="mt-6 inline-flex items-center gap-2 rounded-[1rem] border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            Tell me what you need
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
