import Link from "next/link";
import { ArrowRight, Compass, FolderSearch2, Scale, Search } from "lucide-react";

import CategorySpotlightCard from "@/components/cards/CategorySpotlightCard";
import StatCard from "@/components/cards/StatCard";
import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getFeaturedTools, listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { buildMetadata } from "@/lib/seo/metadata";
import { comparisonSlug, slugify } from "@/lib/slug";
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
  popularCategories: Array<{ label: string; count: number; description: string }>;
  freeTools: Tool[];
  comparisonHighlights: ComparisonHighlight[];
  useCaseLinks: string[];
  recentlyUpdated: Tool[];
  editorialPicks: Tool[];
  audiences: string[];
};

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

async function getHomePageData(): Promise<HomePageData> {
  const [featuredTools, allTools] = await Promise.all([
    getFeaturedTools(6),
    listTools({ status: ["published"] }),
  ]);

  const categoryMap = new Map<string, number>();
  const useCaseMap = new Map<string, number>();

  for (const tool of allTools) {
    categoryMap.set(tool.category, (categoryMap.get(tool.category) ?? 0) + 1);

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
      description: `Browse ${count} reviewed tools for ${label.toLowerCase()} workflows, pricing tiers, and team fit.`,
    }));

  const freeTools = allTools
    .filter((tool) => tool.pricingModel === "free" || tool.pricingModel === "freemium")
    .slice(0, 3);

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
    .slice(0, 8)
    .map(([label]) => label);

  const recentlyUpdated = [...allTools]
    .sort((left, right) => {
      const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightTime - leftTime;
    })
    .slice(0, 4);

  const editorialPicks = allTools
    .filter((tool) => Boolean(tool.aiInsights?.whyThisToolFits || tool.editorialSummary))
    .slice(0, 3);

  const audiences = uniqueValues(allTools.flatMap((tool) => tool.audiences)).slice(0, 4);

  return {
    featuredTools,
    allTools,
    popularCategories,
    freeTools,
    comparisonHighlights,
    useCaseLinks,
    recentlyUpdated,
    editorialPicks,
    audiences,
  };
}

export default async function Home() {
  const {
    featuredTools,
    allTools,
    popularCategories,
    freeTools,
    comparisonHighlights,
    useCaseLinks,
    recentlyUpdated,
    editorialPicks,
    audiences,
  } = await getHomePageData();

  return (
    <div className="flex flex-col gap-16 pb-8 md:gap-24">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 px-6 py-10 shadow-[0_36px_90px_-58px_rgba(17,31,55,0.45)] sm:px-8 md:px-12 md:py-14">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.12),transparent_52%)] lg:block" />
        <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <div className="primary-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <Compass className="h-4 w-4" />
              Search-first software discovery
            </div>

            <div className="space-y-5">
              <h1 className="section-heading max-w-4xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
                Find the right tool before the wrong trial slows you down.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                findmytool is evolving from an AI directory into a decision engine for structured software discovery, comparison, and editorial review.
              </p>
            </div>

            <form action="/tools" className="glass flex flex-col gap-4 rounded-[1.75rem] p-4 shadow-[0_26px_60px_-48px_rgba(17,31,55,0.48)] md:flex-row md:items-center">
              <div className="surface-outline flex flex-1 items-center gap-3 rounded-[1.25rem] bg-background/70 px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search by tool, use case, pricing, or platform"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              >
                Search tools
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              {["Free plan", "AI writing", "Project management", "Collaboration"].map((term) => (
                <Link
                  key={term}
                  href={`/tools?q=${encodeURIComponent(term)}`}
                  className="muted-chip rounded-full px-4 py-2 text-sm hover:border-primary/20 hover:text-primary"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              label="Published Tools"
              value={String(allTools.length)}
              note="Structured records available now through the shared validation layer."
            />
            <StatCard
              label="Top Categories"
              value={String(popularCategories.length)}
              note="The homepage now groups discovery by category instead of a single generic grid."
            />
            <StatCard
              label="Comparison Paths"
              value={String(comparisonHighlights.length)}
              note="Comparison suggestions are now derived from overlap scoring rather than one-off guesses."
            />
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Browse by Category"
          title="Start from the workflow you actually need solved."
          description="These category hubs are derived from the live tool database and tuned for decision-making, not keyword stuffing."
          action={
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
            >
              View full directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {popularCategories.map((category) => (
            <CategorySpotlightCard
              key={category.label}
              label={category.label}
              count={category.count}
              description={category.description}
              href={`/best/${slugify(category.label)}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Editorial Picks"
          title="High-signal tools worth checking first."
          description="A tighter front page with fewer, stronger recommendations and clearer decision context."
        />
        {featuredTools.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[1.75rem] p-10 text-center text-muted-foreground">
            No tools are published yet.
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 rounded-[2rem] border border-success/15 bg-success-soft/65 px-6 py-7 text-foreground shadow-[0_30px_80px_-58px_rgba(15,23,42,0.18)] sm:px-8">
          <div className="space-y-4">
            <p className="success-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Free and Freemium
            </p>
            <h2 className="section-heading text-3xl text-foreground md:text-4xl">Best-value starting points.</h2>
            <p className="text-base leading-7 text-slate-700 md:text-lg">
              Shortlist tools with lower adoption cost when you need speed before procurement.
            </p>
          </div>
          <div className="grid gap-4">
            {freeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-[1.5rem] border border-success/15 bg-card px-5 py-4 shadow-[0_18px_36px_-30px_rgba(5,150,105,0.22)] hover:border-success/25"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {tool.shortDescription}
                    </p>
                  </div>
                  <span className="success-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                    {tool.pricing}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Popular Comparisons"
            title="Head-to-head routes people actually use."
            description="Derived from overlap scoring across category, workflow, pricing, and platform fit."
          />
          <div className="grid gap-4">
            {comparisonHighlights.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="glass-card rounded-[1.6rem] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{comparison.label}</h3>
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{comparison.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Browse by Use Case"
            title="Jump into the decision from your workflow."
            description="These links are generated from the structured use-case fields already attached to tool records."
          />
          <div className="flex flex-wrap gap-3">
            {useCaseLinks.map((useCase) => (
              <Link
                key={useCase}
                href={`/tools-for-${useCase.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
              >
                <FolderSearch2 className="h-4 w-4" />
                {useCase}
              </Link>
            ))}
          </div>

          {audiences.length > 0 ? (
            <div className="rounded-[1.75rem] border border-border/70 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Audience Fit
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {audiences.map((audience) => (
                  <span key={audience} className="muted-chip rounded-full px-4 py-2 text-sm">
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Recently Updated"
            title="Fresh records from the current publishing flow."
            description="Useful while the admin workflow is being rebuilt into a real review and publishing system."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {recentlyUpdated.map((tool) => (
              <Link
                key={tool.slug}
                href={`/alternatives-to-${tool.slug}`}
                className="glass-card rounded-[1.6rem] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Alternatives Hub
                </p>
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  Alternatives to {tool.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Explore replacements and adjacent picks for teams comparing {tool.category.toLowerCase()} tools.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Editorial Notes"
          title="Shortlisted tools with stronger narrative context."
          description="AI is still present, but it now sits on top of structured tool records instead of replacing them."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {editorialPicks.map((tool) => (
            <div key={tool.slug} className="glass-card rounded-[1.75rem] p-6">
              <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                {tool.category}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">{tool.name}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-700">
                {tool.editorialSummary || tool.aiInsights?.whyThisToolFits || tool.shortDescription}
              </p>
              <Link
                href={`/tools/${tool.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Read the review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 sm:p-8">
        <SectionHeader
          eyebrow="FAQ"
          title="What is changing in the product?"
          description="This phase focuses on the public experience: clearer discovery, stronger structure, and better pathing into comparisons and alternatives."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              question: "Is search live yet?",
              answer:
                "The homepage search now routes into the tool directory and sets up the next phase, where filtering and page templates become much stronger.",
            },
            {
              question: "Why does the homepage look different now?",
              answer:
                "The old UI was a generic dark directory. This pass shifts the product toward premium, structured discovery with fewer noisy elements.",
            },
            {
              question: "What comes after this?",
              answer:
                "Next is the deeper template rebuild: tool pages, alternatives pages, comparison pages, and the admin publishing workflow that supports them.",
            },
          ].map((item) => (
            <div key={item.question} className="glass-card rounded-[1.5rem] p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
