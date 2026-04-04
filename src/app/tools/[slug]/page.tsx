import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleOff,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import { getAlternativeTools, getToolBySlug, listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { buildToolPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  getUseCasePath,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import { getConfidenceTone, getPricingTone, getWorkflowStatusTone } from "@/lib/ui";
import { getComparisonPath, slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/database";

export const revalidate = 3600;

export async function generateStaticParams() {
  const tools = await listTools({ status: ["published"] });

  return tools.map((tool) => ({ slug: tool.slug }));
}

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

function formatReviewDate(value?: string) {
  if (!value) {
    return "Recently reviewed";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently reviewed";
  }

  return `Reviewed ${new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parsed)}`;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function clampScore(value: number, min = 0, max = 10) {
  return Math.min(max, Math.max(min, value));
}

function getDifficultyScore(tool: Tool) {
  switch (tool.difficultyLevel) {
    case "beginner":
      return 8.8;
    case "intermediate":
      return 7.4;
    case "advanced":
      return 6.3;
    default:
      return 7.2;
  }
}

function getValueScore(tool: Tool) {
  if (tool.pricingModel === "free") {
    return 9.2;
  }

  if (tool.pricingModel === "freemium") {
    return 8.5;
  }

  if (tool.pricingModel === "custom") {
    return 6.8;
  }

  return tool.hasFreeTrial ? 7.6 : 7;
}

function getCollaborationScore(tool: Tool) {
  const teamSignals = tool.teamFit.length;
  const integrationSignals = Math.min(tool.integrations.length, 5);
  return clampScore(5.4 + teamSignals * 0.8 + integrationSignals * 0.35);
}

function getSupportScore(tool: Tool) {
  return clampScore(6.4 + Math.min(tool.sourceConfidence ?? 0.8, 1) * 2.8);
}

function getFeatureScore(tool: Tool) {
  return clampScore(6.2 + Math.min(tool.features.length, 8) * 0.42);
}

function getEditorScore(tool: Tool) {
  return clampScore((tool.sourceConfidence ?? 0.8) * 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) return { title: "Tool Not Found" };

  return buildToolPageMetadata(tool);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
      tone: "text-success",
    },
    {
      label: "Not ideal for",
      value:
        tool.notIdealFor ||
        tool.aiInsights?.antiRecommendation ||
        "Teams that need fully verified procurement data before review",
      tone: "text-danger",
    },
    {
      label: "Team fit",
      value: formatList(tool.teamFit, "Solo operators, small teams, and mixed workflows"),
      tone: "text-muted-foreground",
    },
    {
      label: "Difficulty",
      value:
        tool.difficulty === "Advanced"
          ? "Steeper learning curve with more setup or system depth."
          : tool.difficulty === "Intermediate"
            ? "Accessible after a short onboarding pass."
            : "Easy to pick up quickly for most teams.",
      tone: "text-muted-foreground",
    },
  ];

  const faqItems =
    tool.faq.length > 0
      ? tool.faq
      : [
          {
            question: `Who is ${tool.name} best for?`,
            answer:
              tool.bestFor || tool.aiInsights?.bestFor || "Teams comparing tools in this category.",
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

  const reviewDate = formatReviewDate(
    tool.factsLastVerifiedAt || tool.aiLastGeneratedAt || tool.updatedAt || tool.createdAt,
  );
  const scoreOutOfTen = getEditorScore(tool);
  const scoreOutOfHundred = Math.round(scoreOutOfTen * 10);
  const detailLine = [
    reviewDate,
    formatList(tool.platforms, "Platform details pending"),
    tool.difficulty || "Intermediate",
  ].join(" · ");
  const pricingLine = [
    tool.pricingRange || "Pricing range pending",
    tool.hasFreePlan ? "Free plan available" : null,
    tool.hasFreeTrial ? "Free trial available" : null,
  ].filter(Boolean);
  const ratingBreakdown = [
    { label: "Features", value: getFeatureScore(tool) },
    { label: "Ease of use", value: getDifficultyScore(tool) },
    { label: "Value", value: getValueScore(tool) },
    { label: "Collaboration", value: getCollaborationScore(tool) },
    { label: "Support confidence", value: getSupportScore(tool) },
  ];
  const overviewText =
    tool.longDescription ||
    tool.editorialSummary ||
    tool.aiInsights?.whyThisToolFits ||
    tool.shortDescription;

  return (
    <div className="pb-24">
      <JsonLd data={serializeJsonLd(jsonLd as Record<string, unknown>[])} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <main className="space-y-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tools" className="hover:text-primary">
              Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/best/${slugify(tool.category)}`} className="hover:text-primary">
              {tool.category}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{tool.name}</span>
          </nav>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.1rem] border border-primary/15 bg-primary-soft text-lg font-semibold text-primary">
                    {getInitials(tool.name)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="primary-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                        {tool.category}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          getPricingTone(tool.pricingModel, tool.pricing),
                        )}
                      >
                        {tool.pricing}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          getWorkflowStatusTone(tool.status),
                        )}
                      >
                        {tool.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="section-heading text-4xl text-foreground md:text-5xl">
                          {tool.name}
                        </h1>
                        {tool.aiInsights ? <BadgeCheck className="h-5 w-5 text-success" /> : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{detailLine}</p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-center">
                  <div
                    className={cn(
                      "mx-auto flex h-20 w-20 flex-col items-center justify-center rounded-full border text-center",
                      getConfidenceTone(scoreOutOfHundred),
                    )}
                  >
                    <span className="text-2xl font-semibold text-current">
                      {scoreOutOfTen.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-current/80">
                      /10
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Editor score</p>
                </div>
              </div>

              <div className="rounded-[1rem] border border-success/20 bg-success-soft px-5 py-4">
                <p className="text-sm leading-7 text-success-soft-foreground">
                  {overviewText}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {tool.website ? (
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[0.9rem] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  >
                    Visit website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                <Link
                  href={`/alternatives-to-${tool.slug}`}
                  className="inline-flex items-center gap-2 rounded-[0.9rem] border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-primary/20 hover:text-primary"
                >
                  Compare alternatives
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#tool-specs"
                  className="inline-flex items-center gap-2 rounded-[0.9rem] border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-primary/20 hover:text-primary"
                >
                  View pricing
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {pricingLine.map((item) => (
                  <span key={item} className="muted-chip rounded-full px-3 py-1.5 text-xs">
                    {item}
                  </span>
                ))}
                {tool.platforms.slice(0, 2).map((platform) => (
                  <span key={platform} className="muted-chip rounded-full px-3 py-1.5 text-xs">
                    {platform}
                  </span>
                ))}
                {tool.integrations.slice(0, 2).map((integration) => (
                  <span key={integration} className="muted-chip rounded-full px-3 py-1.5 text-xs">
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Quick verdict
            </p>
            <div className="mt-5 grid gap-px overflow-hidden rounded-[1rem] border border-border bg-border sm:grid-cols-2">
              {decisionPoints.map((point) => (
                <div key={point.label} className="bg-card px-5 py-4">
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", point.tone)}>
                    {point.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{point.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pros and cons
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1rem] border border-success/20 bg-success-soft/50 p-5">
                <div className="flex items-center gap-2 border-b border-success/15 pb-3">
                  <BadgeCheck className="h-4 w-4 text-success" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success-soft-foreground">
                    Pros
                  </p>
                </div>
                <ul className="mt-4 space-y-3">
                  {tool.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1rem] border border-danger/20 bg-danger-soft/50 p-5">
                <div className="flex items-center gap-2 border-b border-danger/15 pb-3">
                  <CircleOff className="h-4 w-4 text-danger" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-danger-soft-foreground">
                    Cons
                  </p>
                </div>
                <ul className="mt-4 space-y-3">
                  {tool.cons.map((con) => (
                    <li key={con} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                      <CircleOff className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Core features
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {tool.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-[0.95rem] border border-border bg-background/70 px-4 py-3 text-sm text-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Use cases
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tool.useCases.map((useCase) => (
                <Link
                  key={useCase}
                  href={getUseCasePath(useCase)}
                  className="muted-chip rounded-full px-3 py-1.5 text-sm hover:border-primary/20 hover:text-primary"
                >
                  {useCase}
                </Link>
              ))}
            </div>
          </section>

          {alternatives.length > 0 ? (
            <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Top alternatives
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    Closest substitutes worth checking.
                  </h2>
                </div>
                <Link
                  href={`/alternatives-to-${tool.slug}`}
                  className="text-sm font-medium text-primary hover:text-primary-hover"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 divide-y divide-border">
                {alternatives.map((alternative) => (
                  <Link
                    key={alternative.slug}
                    href={`/tools/${alternative.slug}`}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-border bg-primary-soft text-sm font-semibold text-primary">
                      {getInitials(alternative.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{alternative.name}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
                            getPricingTone(alternative.pricingModel, alternative.pricing),
                          )}
                        >
                          {alternative.pricing}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {alternative.aiInsights?.comparisonSummary ||
                          alternative.shortDescription ||
                          alternative.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Common questions
            </p>
            <div className="mt-5 space-y-3">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-[1rem] border border-border bg-card px-4 py-4">
                  <h2 className="text-sm font-semibold text-foreground">{item.question}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <section
            id="tool-specs"
            className="glass-card rounded-[1.5rem] border border-border/80 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tool specs
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Pricing</span>
                <span className="font-medium text-foreground">{tool.pricingRange || tool.pricing}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Pricing model</span>
                <span className="font-medium text-foreground">{tool.pricing}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Platforms</span>
                <span className="max-w-[11rem] text-right font-medium text-foreground">
                  {formatList(tool.platforms, "Pending")}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium text-foreground">{tool.difficulty}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Free plan</span>
                <span className={cn("font-medium", tool.hasFreePlan ? "text-success" : "text-foreground")}>
                  {tool.hasFreePlan ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground">{tool.status}</span>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Rating breakdown
            </p>
            <div className="mt-4 space-y-4">
              {ratingBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.value.toFixed(1)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${Math.round(item.value * 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {comparisonSuggestions.length > 0 ? (
            <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Compare with
              </p>
              <div className="mt-4 space-y-2">
                {comparisonSuggestions.map((suggestion) => (
                  <Link
                    key={suggestion.slug}
                    href={getComparisonPath(tool.slug, suggestion.slug)}
                    className="flex items-center justify-between rounded-[0.95rem] border border-border bg-background/70 px-4 py-3 text-sm text-foreground hover:border-primary/20 hover:text-primary"
                  >
                    <span>{suggestion.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[1.5rem] border border-success/20 bg-success-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success-soft-foreground">
              Editorial note
            </p>
            <p className="mt-3 text-sm leading-6 text-success-soft-foreground">
              {tool.editorialSummary ||
                tool.aiInsights?.whyThisToolFits ||
                `${tool.name} remains a strong option when you need a dependable ${tool.category.toLowerCase()} workflow with clear trade-offs.`}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
