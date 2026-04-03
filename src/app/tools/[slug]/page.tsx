import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleOff,
  ExternalLink,
  Layers,
  Target,
} from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getAlternativeTools, getToolBySlug, listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  getUseCasePath,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import { slugify } from "@/lib/slug";
import type { Tool } from "@/types/database";

export const revalidate = 3600;

async function getTool(slug: string): Promise<Tool | null> {
  return getToolBySlug(slug);
}

async function getComparisonSuggestions(tool: Tool) {
  const tools = await listTools({ status: ["published"] });

  return tools
    .filter((candidate) => candidate.slug !== tool.slug)
    .map((candidate) => ({
      tool: candidate,
      score: scoreComparisonPair(tool, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.tool);
}

function formatList(values: string[], fallback: string) {
  return values.length > 0 ? values.join(", ") : fallback;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) return { title: "Tool Not Found" };

  return buildMetadata({
    title: `${tool.name} Review, Pricing & AI Insights (2026)`,
    description: tool.shortDescription,
    path: `/tools/${tool.slug}`,
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    notFound();
  }

  const [alternatives, comparisonSuggestions] = await Promise.all([
    getAlternativeTools(tool, 3),
    getComparisonSuggestions(tool),
  ]);

  const decisionPoints = [
    {
      label: "Best for",
      value: tool.bestFor || tool.aiInsights?.bestFor || "General evaluation and workflow fit",
    },
    {
      label: "Not ideal for",
      value:
        tool.notIdealFor ||
        tool.aiInsights?.antiRecommendation ||
        "Teams that need fully verified procurement data before review",
    },
    {
      label: "Team fit",
      value: formatList(tool.teamFit, "Solo operators, small teams, and mixed workflows"),
    },
  ];
  const faqItems =
    tool.faq.length > 0
      ? tool.faq
      : [
          {
            question: `Who is ${tool.name} best for?`,
            answer: tool.bestFor || tool.aiInsights?.bestFor || "Teams comparing tools in this category.",
          },
          {
            question: `How is ${tool.name} priced?`,
            answer: `${tool.pricing} pricing with ${tool.pricingRange}.`,
          },
        ];
  const jsonLd = [
    buildSoftwareApplicationJsonLd(tool),
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: tool.category, path: `/best/${slugify(tool.category)}` },
      { name: tool.name, path: `/tools/${tool.slug}` },
    ]),
    buildFaqJsonLd(faqItems),
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-14 pb-24">
      <JsonLd data={serializeJsonLd(jsonLd as Record<string, unknown>[])} />

      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl space-y-6">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to tools
            </Link>

            <div className="flex flex-wrap gap-3">
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {tool.category}
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {tool.status}
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {tool.pricing}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                {tool.name}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {tool.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={tool.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              >
                Visit website
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href={`/alternatives-to-${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              >
                View alternatives
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:w-[25rem] xl:grid-cols-1">
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Pricing Snapshot
              </p>
              <p className="mt-4 text-3xl font-bold text-foreground">{tool.pricing}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.pricingRange}</p>
            </div>
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Platforms
              </p>
              <p className="mt-4 text-lg font-semibold text-foreground">
                {formatList(tool.platforms, "Platform details pending")}
              </p>
            </div>
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Difficulty
              </p>
              <p className="mt-4 text-lg font-semibold text-foreground">{tool.difficulty}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-border/70 bg-secondary px-6 py-7 text-secondary-foreground sm:px-8">
          <SectionHeader
            eyebrow="Quick Decision"
            title="The short version."
            description="Use this panel to decide whether the tool is worth a deeper review."
          />
          <div className="mt-8 grid gap-4">
            {decisionPoints.map((point) => (
              <div key={point.label} className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  {point.label}
                </p>
                <p className="mt-2 text-sm leading-6">{point.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Overview"
            title="Structured editorial context."
            description="This page now combines structured fields, editorial framing, and related decision paths."
          />
          <div className="glass-card rounded-[1.75rem] p-6">
            <p className="text-sm leading-7 text-muted-foreground">
              {tool.longDescription || tool.editorialSummary || tool.aiInsights?.whyThisToolFits || tool.shortDescription}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Audiences
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {formatList(tool.audiences, "Audience details pending review")}
              </p>
            </div>
            <div className="glass-card rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Setup Time
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {tool.setupTime || "Setup timing not yet documented"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Core Features"
            title="What you are actually getting."
            description="A stronger page structure starts with clearer, scannable product facts."
          />
          <div className="glass-card rounded-[1.75rem] p-6">
            <ul className="grid gap-4 md:grid-cols-2">
              {tool.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Platforms and Integrations"
            title="How the tool fits into the stack."
            description="Useful for shortlisting based on workflow and compatibility."
          />
          <div className="glass-card rounded-[1.75rem] p-6">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Platforms
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tool.platforms.map((platform) => (
                    <span key={platform} className="muted-chip rounded-full px-3 py-1.5 text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Integrations
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tool.integrations.length > 0 ? (
                    tool.integrations.map((integration) => (
                      <span key={integration} className="muted-chip rounded-full px-3 py-1.5 text-sm">
                        {integration}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Integration details pending review.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Pros</h2>
          </div>
          <ul className="mt-6 space-y-3">
            {tool.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <CircleOff className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Cons</h2>
          </div>
          <ul className="mt-6 space-y-3">
            {tool.cons.map((con) => (
              <li key={con} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <CircleOff className="mt-0.5 h-4 w-4 text-primary" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Related Paths"
          title="Next steps from this tool page."
          description="Every major public page should point users into alternatives, comparisons, and adjacent tools."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            href={`/alternatives-to-${tool.slug}`}
            className="glass-card rounded-[1.75rem] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Alternatives Hub
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              Explore alternatives to {tool.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Compare adjacent tools when you need a cheaper, simpler, or more specialized fit.
            </p>
          </Link>

          {comparisonSuggestions.map((suggestion) => (
            <Link
              key={suggestion.slug}
              href={`/compare/${tool.slug}-vs-${suggestion.slug}`}
              className="glass-card rounded-[1.75rem] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Comparison
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                {tool.name} vs {suggestion.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {suggestion.aiInsights?.comparisonSummary || `See how ${tool.name} and ${suggestion.name} differ across pricing, setup, and workflow.`}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {alternatives.length > 0 ? (
        <section className="space-y-8">
          <SectionHeader
            eyebrow="Top Alternatives"
            title="Closest substitutes worth checking."
            description="Ranked through the shared alternatives utility instead of a single category match."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {alternatives.map((alternative) => (
              <ToolCard key={alternative.slug} tool={alternative} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Use Cases</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {tool.useCases.map((useCase) => (
              <Link
                key={useCase}
                href={getUseCasePath(useCase)}
                className="muted-chip rounded-full px-4 py-2 text-sm hover:text-foreground"
              >
                {useCase}
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">FAQ Snapshot</h2>
          </div>
          <div className="mt-6 space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-[1.25rem] border border-border/70 p-4">
                <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
