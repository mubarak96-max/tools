import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import { getComparisonBySlug, listComparisonSlugs } from "@/lib/db/comparisons";
import { getToolBySlug } from "@/lib/db/tools";
import { buildComparisonPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import type { Tool } from "@/types/database";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await listComparisonSlugs();

  return slugs.map((slug) => ({ slug }));
}

async function getTool(slug: string): Promise<Tool | null> {
  return getToolBySlug(slug);
}

function getVerdict(tool1: Tool, tool2: Tool) {
  if (tool1.hasFreePlan && !tool2.hasFreePlan) {
    return `${tool1.name} is easier to trial because it offers a free entry point.`;
  }

  if ((tool2.features.length ?? 0) > (tool1.features.length ?? 0)) {
    return `${tool2.name} looks stronger on feature breadth, while ${tool1.name} may win on focus.`;
  }

  return `${tool1.name} and ${tool2.name} are close; the better choice depends on your workflow and tolerance for setup complexity.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return { title: "Comparison Not Found" };

  const [tool1, tool2] = await Promise.all([
    getTool(comparison.toolA),
    getTool(comparison.toolB),
  ]);

  if (!tool1 || !tool2) return { title: "Comparison Not Found" };

  return buildComparisonPageMetadata(tool1, tool2);
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  const [tool1, tool2] = await Promise.all([
    getTool(comparison.toolA),
    getTool(comparison.toolB),
  ]);

  if (!tool1 || !tool2) {
    notFound();
  }

  const verdict = getVerdict(tool1, tool2);
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: tool1.name, path: `/tools/${tool1.slug}` },
      { name: `${tool1.name} vs ${tool2.name}`, path: `/compare/${comparison.slug}` },
    ]),
    buildItemListJsonLd(
      [
        { name: tool1.name, path: `/tools/${tool1.slug}` },
        { name: tool2.name, path: `/tools/${tool2.slug}` },
      ],
      `${tool1.name} vs ${tool2.name}`,
    ),
  ];

  return (
    <div className="flex flex-col gap-14 pb-24">
      <JsonLd data={serializeJsonLd(jsonLd)} />
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                Comparison
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {tool1.category}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                {tool1.name} vs {tool2.name}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                A structured comparison across pricing, setup, use-case fit, and the decision points that matter before you commit.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-[1.25rem] border border-primary/20 bg-primary/8 px-4 py-3 text-sm text-primary">
              <Scale className="h-4 w-4" />
              {verdict}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {[tool1, tool2].map((tool) => (
              <div key={tool.slug} className="glass-card rounded-[1.5rem] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {tool.name}
                </p>
                <p className="mt-4 text-lg font-semibold text-foreground">{tool.pricingRange}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {tool.bestFor || tool.aiInsights?.bestFor || tool.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {[tool1, tool2].map((tool) => (
          <div key={tool.slug} className="glass-card rounded-[1.75rem] p-6">
            <h2 className="text-3xl font-semibold text-foreground">{tool.name}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{tool.shortDescription}</p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.25rem] border border-border/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Best for
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {tool.bestFor || tool.aiInsights?.bestFor || "General software evaluation"}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pricing
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{tool.pricingRange}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Difficulty
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{tool.difficulty}</p>
              </div>
            </div>

            <Link
              href={`/tools/${tool.slug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Review {tool.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Snapshot Table"
          title="The fastest way to compare them."
          description="This page now exposes the decision criteria directly instead of forcing the reader to infer them."
        />
        <div className="overflow-x-auto rounded-[1.75rem] border border-border/70 bg-card/80">
          <table className="min-w-full text-left">
            <thead className="border-b border-border/70 bg-background/40">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-foreground">Criteria</th>
                <th className="px-5 py-4 text-sm font-semibold text-foreground">{tool1.name}</th>
                <th className="px-5 py-4 text-sm font-semibold text-foreground">{tool2.name}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Pricing", tool1.pricingRange, tool2.pricingRange],
                ["Difficulty", tool1.difficulty, tool2.difficulty],
                ["Free Plan", tool1.hasFreePlan ? "Yes" : "No", tool2.hasFreePlan ? "Yes" : "No"],
                ["Platforms", tool1.platforms.join(", "), tool2.platforms.join(", ")],
                ["Top Use Case", tool1.useCases[0] || "Pending", tool2.useCases[0] || "Pending"],
              ].map(([label, left, right]) => (
                <tr key={label} className="border-b border-border/60 last:border-b-0">
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{label}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{left}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">When to choose {tool1.name}</h2>
          </div>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>{tool1.bestFor || tool1.aiInsights?.bestFor || `Choose ${tool1.name} when its workflow fit matches your team.`}</li>
            <li>{tool1.aiInsights?.comparisonSummary || `${tool1.name} may be the stronger option if you value its particular product angle.`}</li>
            <li>Use the direct review if {tool1.name} is still the frontrunner after this comparison.</li>
          </ul>
        </div>

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">When to choose {tool2.name}</h2>
          </div>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>{tool2.bestFor || tool2.aiInsights?.bestFor || `Choose ${tool2.name} when its workflow fit matches your team.`}</li>
            <li>{tool2.aiInsights?.comparisonSummary || `${tool2.name} may be the stronger option if you need broader feature depth or a different stack fit.`}</li>
            <li>Use the direct review if {tool2.name} remains the better fit after this head-to-head.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] p-6">
        <SectionHeader
          eyebrow="Final Recommendation"
          title="Decide by audience, not by hype."
          description="The winner changes depending on budget, onboarding tolerance, and the workflow you are optimizing for."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Lean toward {tool1.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If your team matches {tool1.bestFor || tool1.aiInsights?.bestFor || "its primary workflow"} and you want the product shape it offers today.
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Lean toward {tool2.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If your team matches {tool2.bestFor || tool2.aiInsights?.bestFor || "its primary workflow"} and the second option solves more of the gaps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
