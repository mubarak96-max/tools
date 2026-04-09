import Link from "next/link";
import type { Metadata } from "next";
import { FolderSearch2, Layers3, Scale, Users } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getUseCaseHubData, listUseCaseHubSlugs } from "@/lib/discovery/hubs";
import { buildUseCaseHubMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  getUseCasePath,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const useCases = await listUseCaseHubSlugs();

  return useCases.map((usecase) => ({ usecase }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ usecase: string }>;
}): Promise<Metadata> {
  const { usecase } = await params;
  const hub = await getUseCaseHubData(usecase);

  if (!hub) {
    return { title: "Use Case Not Found" };
  }

  return buildUseCaseHubMetadata(hub);
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ usecase: string }>;
}) {
  const { usecase } = await params;
  const hub = await getUseCaseHubData(usecase);

  if (!hub) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: hub.useCaseLabel, path: getUseCasePath(hub.useCaseSlug) },
  ]);
  const itemListJsonLd = buildItemListJsonLd(
    hub.featuredTools.map((tool) => ({ name: tool.name, path: `/tools/${tool.slug}` })),
    `Best Tools for ${hub.useCaseLabel}`,
  );

  return (
    <div className="flex flex-col gap-14 pb-24">
      <JsonLd data={serializeJsonLd([breadcrumbJsonLd, itemListJsonLd])} />

      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                Use-Case Hub
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {hub.tools.length} tools
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                Best tools for {hub.useCaseLabel}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {hub.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Categories
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{hub.categoryLinks.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Category routes that already support this workflow.
              </p>
            </div>
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Comparison Paths
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{hub.comparisonHighlights.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Suggested head-to-head routes inside this use case.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Top Picks"
          title={`Start with the strongest tools for ${hub.useCaseLabel.toLowerCase()}`}
          description="These picks are derived from published records that explicitly match the use case."
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
            <FolderSearch2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Browse by category</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {hub.categoryLinks.map((category) => (
              <Link
                key={category.slug}
                href={`/best/${category.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
              >
                {category.label}
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Browse by audience</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {hub.audienceLinks.map((audience) => (
              <Link
                key={audience.slug}
                href={`/tools?q=${encodeURIComponent(audience.label)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
              >
                {audience.label}
                <span className="text-xs text-muted-foreground">{audience.count}</span>
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
            description="Use these when the shortlist is down to a small set and you need a direct comparison."
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
            title="Replacement hubs from this use case"
            description="Jump directly into alternative routes if you are replacing an incumbent rather than searching from scratch."
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
                      {tool.notIdealFor || tool.aiInsights?.antiRecommendation || `See which tools compete most closely with ${tool.name} for ${hub.useCaseLabel.toLowerCase()}.`}
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
          eyebrow="Full Grid"
          title={`All published tools for ${hub.useCaseLabel.toLowerCase()}`}
          description="Use the full grid when you want a broader scan after narrowing by workflow."
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
