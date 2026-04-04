import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FolderSearch2, Layers3, Scale, Users } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getCategoryHubData, listCategoryHubSlugs } from "@/lib/discovery/hubs";
import { buildCategoryHubMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  getUseCasePath,
  buildItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await listCategoryHubSlugs();

  return categories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const hub = await getCategoryHubData(category);

  if (!hub) {
    return { title: "Category Not Found" };
  }

  return buildCategoryHubMetadata(hub);
}

export default async function BestCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const hub = await getCategoryHubData(category);

  if (!hub) {
    notFound();
  }

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Best", path: "/tools" },
      { name: hub.categoryLabel, path: `/best/${hub.categorySlug}` },
    ]),
    buildItemListJsonLd(
      hub.featuredTools.map((tool) => ({ name: tool.name, path: `/tools/${tool.slug}` })),
      `Best ${hub.categoryLabel} Tools`,
    ),
  ];

  return (
    <div className="flex flex-col gap-14 pb-24">
      <JsonLd data={serializeJsonLd(jsonLd)} />
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                Category Hub
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {hub.tools.length} tools
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                Best {hub.categoryLabel} tools
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {hub.categoryDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/tools?q=${encodeURIComponent(hub.categoryLabel)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              >
                Search full directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Audience Paths
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{hub.audienceLinks.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Filter this category by the team or user profile you are buying for.
              </p>
            </div>
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Comparison Paths
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{hub.comparisonHighlights.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Head-to-head routes derived from overlapping workflows inside this category.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Top Picks"
          title={`Start with the strongest ${hub.categoryLabel.toLowerCase()} options.`}
          description="These picks are ranked from the published records already validated in the shared data layer."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {hub.featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Browse by audience</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {hub.audienceLinks.map((audience) => (
              <Link
                key={audience.slug}
                href={`/best/${hub.categorySlug}/for/${audience.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
              >
                {audience.label}
                <span className="text-xs text-muted-foreground">{audience.count}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <FolderSearch2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Popular use cases</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {hub.useCaseLinks.map((useCase) => (
              <Link
                key={useCase.slug}
                href={getUseCasePath(useCase.slug)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
              >
                {useCase.label}
                <span className="text-xs text-muted-foreground">{useCase.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Comparisons"
            title="Popular head-to-head routes"
            description="Comparison pages are suggested from overlap scoring across this category, not arbitrary pairings."
          />
          <div className="grid gap-4">
            {hub.comparisonHighlights.map((comparison) => (
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

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Alternatives"
            title="Jump directly into replacement hubs"
            description="Use these when you already know the incumbent tool and want the fastest route into alternatives."
          />
          <div className="grid gap-4">
            {hub.alternativeTargets.map((tool) => (
              <Link
                key={tool.slug}
                href={`/alternatives-to-${tool.slug}`}
                className="glass-card rounded-[1.6rem] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Alternatives to {tool.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tool.notIdealFor || tool.aiInsights?.antiRecommendation || `See which ${hub.categoryLabel.toLowerCase()} tools compete most closely with ${tool.name}.`}
                    </p>
                  </div>
                  <Layers3 className="h-5 w-5 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Full Category Grid"
          title={`All published ${hub.categoryLabel.toLowerCase()} tools`}
          description="Use this broader grid once you have narrowed the market by audience, workflow, or price sensitivity."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {hub.tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
