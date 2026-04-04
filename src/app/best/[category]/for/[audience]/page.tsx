import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FolderSearch2, Scale, Users } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getCategoryAudienceHubData, listCategoryAudienceHubSlugs } from "@/lib/discovery/hubs";
import { buildCategoryAudienceHubMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  getUseCasePath,
  buildItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 3600;

export async function generateStaticParams() {
  return listCategoryAudienceHubSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; audience: string }>;
}): Promise<Metadata> {
  const { category, audience } = await params;
  const hub = await getCategoryAudienceHubData(category, audience);

  if (!hub) {
    return { title: "Audience Hub Not Found" };
  }

  return buildCategoryAudienceHubMetadata(hub);
}

export default async function BestCategoryAudiencePage({
  params,
}: {
  params: Promise<{ category: string; audience: string }>;
}) {
  const { category, audience } = await params;
  const hub = await getCategoryAudienceHubData(category, audience);

  if (!hub) {
    notFound();
  }

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: hub.categoryLabel, path: `/best/${hub.categorySlug}` },
      { name: hub.audienceLabel, path: `/best/${hub.categorySlug}/for/${hub.audienceSlug}` },
    ]),
    buildItemListJsonLd(
      hub.featuredTools.map((tool) => ({ name: tool.name, path: `/tools/${tool.slug}` })),
      `Best ${hub.categoryLabel} Tools for ${hub.audienceLabel}`,
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
                Audience Hub
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {hub.categoryLabel}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                Best {hub.categoryLabel} tools for {hub.audienceLabel}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                A narrower shortlist for {hub.audienceLabel.toLowerCase()} teams choosing inside the {hub.categoryLabel.toLowerCase()} category.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/best/${hub.categorySlug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              >
                View full {hub.categoryLabel} hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Matching Tools
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{hub.tools.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Published tools in this category that explicitly fit this audience.
              </p>
            </div>
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Use Cases
              </p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{hub.useCaseLinks.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Common workflows inside this audience slice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Top Picks"
          title={`Best ${hub.categoryLabel.toLowerCase()} tools for ${hub.audienceLabel.toLowerCase()}`}
          description="This shortlist stays inside one category and one audience instead of mixing broad directory search results."
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
            <h2 className="text-2xl font-semibold text-foreground">Browse by use case</h2>
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

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Other audiences in this category</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {hub.audienceLinks.map((audienceLink) => (
              <Link
                key={audienceLink.slug}
                href={`/best/${hub.categorySlug}/for/${audienceLink.slug}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                  audienceLink.slug === hub.audienceSlug
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {audienceLink.label}
                <span className="text-xs text-muted-foreground">{audienceLink.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Comparisons"
          title="Relevant head-to-head routes"
          description="These comparison links stay inside the filtered audience slice where possible."
        />
        <div className="grid gap-4 md:grid-cols-2">
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
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Full Grid"
          title={`${hub.categoryLabel} tools for ${hub.audienceLabel}`}
          description="Use the full set if your shortlist still needs more nuance around price, setup time, or integrations."
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
