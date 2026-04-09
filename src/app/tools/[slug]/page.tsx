import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
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
import { getPricingTone } from "@/lib/ui";
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

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("rounded-[1.5rem] border border-border bg-card p-5", className)}>{children}</section>;
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
  const overviewText =
    tool.longDescription ||
    tool.editorialSummary ||
    tool.aiInsights?.whyThisToolFits ||
    tool.shortDescription;
  const ratingBreakdown = [
    { label: "Features", value: getFeatureScore(tool) },
    { label: "Ease of use", value: getDifficultyScore(tool) },
    { label: "Value for money", value: getValueScore(tool) },
    { label: "Collaboration", value: getCollaborationScore(tool) },
    { label: "Support", value: getSupportScore(tool) },
  ];

  const bestForText =
    tool.bestFor || tool.aiInsights?.bestFor || "General evaluation and workflow fit.";
  const notIdealText =
    tool.notIdealFor ||
    tool.aiInsights?.antiRecommendation ||
    "Teams that need deeper enterprise controls or a more rigid workflow model.";

  return (
    <div className="pb-24">
      <JsonLd data={serializeJsonLd(jsonLd as Record<string, unknown>[])} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <main className="space-y-4">
          <nav className="flex flex-wrap items-center gap-2 border-b border-border/80 bg-card px-4 py-3 text-sm text-muted-foreground sm:px-5">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/best/${slugify(tool.category)}`} className="hover:text-primary">
              {tool.category}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{tool.name}</span>
          </nav>

          <Card>
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] bg-primary-soft text-sm font-semibold text-primary">
                {getInitials(tool.name)}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-[1.65rem] font-semibold tracking-tight text-foreground">
                  {tool.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      getPricingTone(tool.pricingModel, tool.pricing),
                    )}
                  >
                    {tool.pricing}
                  </span>
                  <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {tool.category}
                  </span>
                  <span className="rounded-md border border-warning/20 bg-warning-soft px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-warning-soft-foreground">
                    {tool.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">{reviewDate}</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-4xl font-semibold leading-none text-foreground">
                  {scoreOutOfTen.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">/10</div>
                <div className="mt-1 text-xs text-muted-foreground">editor score</div>
              </div>
            </div>

            <p className="text-[15px] leading-7 text-muted-foreground">{overviewText}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {tool.website ? (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[0.9rem] border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Visit {tool.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              <Link
                href={`/alternatives-to-${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-[0.9rem] border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
              >
                Compare alternatives
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/alternatives-to-${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-[0.9rem] border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
              >
                Get recommendation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Quick verdict</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1rem] bg-success-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-success-soft-foreground">
                  Best for
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{bestForText}</p>
              </div>
              <div className="rounded-[1rem] bg-danger-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger-soft-foreground">
                  Not ideal for
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{notIdealText}</p>
              </div>
            </div>
            <div className="mt-3 rounded-[1rem] bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">Team fit:</span>{" "}
              {formatList(tool.teamFit, "Solo operators, small teams, and mixed workflows")}
              {" · "}
              <span className="font-medium text-foreground">Pricing:</span>{" "}
              {tool.pricingRange || "Pricing range pending"}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Pros and cons</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-success">
                  Strengths
                </p>
                <div className="space-y-2">
                  {tool.pros.map((pro) => (
                    <div key={pro} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-danger">
                  Weaknesses
                </p>
                <div className="space-y-2">
                  {tool.cons.map((con) => (
                    <div key={con} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Rating breakdown</h2>
            <div className="mt-4 space-y-3">
              {ratingBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm text-muted-foreground">{item.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round(item.value * 10)}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-medium text-foreground">
                    {item.value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Core features</h2>
            <div className="mt-4 space-y-2">
              {tool.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Use cases</h2>
            <div className="mt-4 space-y-2">
              {tool.useCases.map((useCase) => (
                <Link
                  key={useCase}
                  href={getUseCasePath(useCase)}
                  className="flex items-center gap-3 rounded-[0.9rem] border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
                >
                  <span>{useCase}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </Card>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <Card>
            <h2 className="text-base font-semibold text-foreground">Tool specs</h2>
            <div className="mt-3 divide-y divide-border">
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-muted-foreground">Pricing</span>
                <span className="font-medium text-foreground">{tool.pricingRange || tool.pricing}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium text-foreground">{tool.pricing}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-muted-foreground">Free plan</span>
                <span className={cn("font-medium", tool.hasFreePlan ? "text-success" : "text-foreground")}>
                  {tool.hasFreePlan ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium text-foreground">{tool.difficulty}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-muted-foreground">Team fit</span>
                <span className="text-right font-medium text-foreground">
                  {tool.teamFit.slice(0, 2).join(" + ") || "Solo + small teams"}
                </span>
              </div>
              <div className="py-3 text-sm">
                <div className="mb-2 text-muted-foreground">Platforms</div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {tool.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {comparisonSuggestions.length > 0 ? (
            <Card>
              <h2 className="text-base font-semibold text-foreground">Compare with</h2>
              <div className="mt-3 space-y-2">
                {comparisonSuggestions.map((suggestion) => (
                  <Link
                    key={suggestion.slug}
                    href={getComparisonPath(tool.slug, suggestion.slug)}
                    className="flex items-center justify-between rounded-[0.9rem] border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        VS
                      </span>
                      <span>{suggestion.name}</span>
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}

          {alternatives.length > 0 ? (
            <Card>
              <h2 className="text-base font-semibold text-foreground">Top alternatives</h2>
              <div className="mt-3 space-y-2">
                {alternatives.map((alternative) => (
                  <Link
                    key={alternative.slug}
                    href={`/tools/${alternative.slug}`}
                    className="flex items-center gap-3 rounded-[0.9rem] border border-border px-3 py-3 transition-colors hover:border-primary/20"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.75rem] bg-primary-soft text-[11px] font-semibold text-primary">
                      {getInitials(alternative.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{alternative.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {alternative.aiInsights?.comparisonSummary ||
                          alternative.shortDescription ||
                          alternative.description}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]",
                        getPricingTone(alternative.pricingModel, alternative.pricing),
                      )}
                    >
                      {alternative.pricing}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}

          <section className="rounded-[1.5rem] border border-border bg-muted p-5 text-center">
            <p className="text-sm leading-6 text-muted-foreground">
              Not sure if {tool.name} is right for your workflow?
            </p>
            <Link
              href={`/alternatives-to-${tool.slug}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[0.9rem] border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              Get a recommendation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
