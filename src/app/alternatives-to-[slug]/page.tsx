import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleOff, Scale } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getAlternativeTools, getToolBySlug, listTools } from "@/lib/db/tools";
import { buildAlternativesPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import { getComparisonPath } from "@/lib/slug";
import type { Tool } from "@/types/database";

export const revalidate = 3600;

export async function generateStaticParams() {
  const tools = await listTools({ status: ["published"] });

  return tools.map((tool) => ({ slug: tool.slug }));
}

async function getTargetTool(slug: string): Promise<Tool | null> {
  return getToolBySlug(slug);
}

async function getAlternatives(targetTool: Tool): Promise<Tool[]> {
  return getAlternativeTools(targetTool, 8);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTargetTool(slug);
  if (!tool) return { title: "Not Found" };

  return buildAlternativesPageMetadata(tool, 8);
}

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const targetTool = await getTargetTool(slug);
  if (!targetTool) notFound();

  const alternatives = await getAlternatives(targetTool);
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: targetTool.name, path: `/tools/${targetTool.slug}` },
      { name: `Alternatives to ${targetTool.name}`, path: `/alternatives-to-${targetTool.slug}` },
    ]),
    buildItemListJsonLd(
      alternatives.map((tool) => ({ name: tool.name, path: `/tools/${tool.slug}` })),
      `Alternatives to ${targetTool.name}`,
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
                Alternatives Hub
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {targetTool.category}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                Best alternatives to {targetTool.name}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Switch with more context: compare replacements by workflow fit, pricing, difficulty, and the tradeoffs that matter before migration.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/tools/${targetTool.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              >
                Review {targetTool.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-secondary px-6 py-6 text-secondary-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
              Why people switch
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
                <p className="text-sm leading-6">
                  {targetTool.notIdealFor || targetTool.aiInsights?.antiRecommendation || "They need a better fit for a narrower workflow or team structure."}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
                <p className="text-sm leading-6">
                  They are checking whether another tool has a better pricing model than {targetTool.pricingRange}.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
                <p className="text-sm leading-6">
                  They want a different balance of setup complexity, integrations, and platform support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {alternatives.length > 0 ? (
        <>
          <section className="space-y-8">
            <SectionHeader
              eyebrow="At a Glance"
              title="Closest replacement options first."
              description="These cards now come from the weighted alternatives ranking utility instead of a single category match."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {alternatives.slice(0, 3).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <SectionHeader
              eyebrow="Comparison Matrix"
              title="How the shortlist differs."
              description="A quick matrix for pricing, difficulty, free access, and use-case fit."
            />
            <div className="overflow-x-auto rounded-[1.75rem] border border-border/70 bg-card/80">
              <table className="min-w-full text-left">
                <thead className="border-b border-border/70 bg-background/40">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold text-foreground">Tool</th>
                    <th className="px-5 py-4 text-sm font-semibold text-foreground">Pricing</th>
                    <th className="px-5 py-4 text-sm font-semibold text-foreground">Difficulty</th>
                    <th className="px-5 py-4 text-sm font-semibold text-foreground">Free Plan</th>
                    <th className="px-5 py-4 text-sm font-semibold text-foreground">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {[targetTool, ...alternatives.slice(0, 4)].map((tool) => (
                    <tr key={tool.slug} className="border-b border-border/60 last:border-b-0">
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">{tool.name}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{tool.pricingRange}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{tool.difficulty}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{tool.hasFreePlan ? "Yes" : "No"}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {tool.bestFor || tool.aiInsights?.bestFor || "General software evaluation"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="glass-card rounded-[1.75rem] p-6">
              <div className="flex items-center gap-2">
                <CircleOff className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">How to choose</h2>
              </div>
              <ol className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
                <li>1. Start with the workflow gap that made you look beyond {targetTool.name}.</li>
                <li>2. Narrow by pricing model and onboarding difficulty before you compare feature depth.</li>
                <li>3. Use side-by-side comparisons for the final two options, not the full market.</li>
              </ol>
            </div>

            <div className="glass-card rounded-[1.75rem] p-6">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Related links</h2>
              </div>
              <div className="mt-6 grid gap-3">
                {alternatives.slice(0, 3).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getComparisonPath(targetTool.slug, tool.slug)}
                    className="rounded-[1.25rem] border border-border/70 px-4 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
                  >
                    Compare {targetTool.name} vs {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <SectionHeader
              eyebrow="Full Alternatives List"
              title="More tools in the same decision space."
              description="Contextual internal links are now part of the page flow, not hidden in the footer."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {alternatives.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="glass-card rounded-[1.75rem] p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No alternatives found yet.</h3>
          <p className="text-muted-foreground">
            We need more published tools in this decision space before this hub can rank replacements properly.
          </p>
        </div>
      )}
    </div>
  );
}
