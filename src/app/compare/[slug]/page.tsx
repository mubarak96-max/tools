import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight, Scale } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import { getComparisonBySlug, listComparisonSlugs } from "@/lib/db/comparisons";
import { getToolBySlug, listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { buildComparisonPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import { getPricingTone } from "@/lib/ui";
import { getComparisonPath } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/database";

export const revalidate = 3600;

type ComparisonRow = {
  label: string;
  left: string;
  right: string;
  winner: "left" | "right" | null;
};

type RelatedComparison = {
  label: string;
  path: string;
};

export async function generateStaticParams() {
  const slugs = await listComparisonSlugs();

  return slugs.map((slug) => ({ slug }));
}

async function getTool(slug: string): Promise<Tool | null> {
  return getToolBySlug(slug);
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

function getEditorScore(tool: Tool) {
  return clampScore((tool.sourceConfidence ?? 0.8) * 10);
}

function getDifficultyRank(tool: Tool) {
  switch (tool.difficultyLevel) {
    case "beginner":
      return 0;
    case "intermediate":
      return 1;
    case "advanced":
      return 2;
    default:
      return 1;
  }
}

function getPricingRank(tool: Tool) {
  switch (tool.pricingModel) {
    case "free":
      return 0;
    case "freemium":
      return 1;
    case "paid":
      return 2;
    case "custom":
      return 3;
    default:
      return 4;
  }
}

function getMobileCoverage(tool: Tool) {
  return Number(tool.platforms.includes("iOS")) + Number(tool.platforms.includes("Android"));
}

function getMostTeamsScore(tool: Tool) {
  return (
    getEditorScore(tool) +
    (tool.hasFreePlan ? 0.9 : 0) +
    (tool.hasFreeTrial ? 0.2 : 0) +
    (2 - getDifficultyRank(tool)) * 0.35 +
    Math.min(tool.integrations.length, 6) * 0.08 +
    getMobileCoverage(tool) * 0.18
  );
}

function getPowerScore(tool: Tool) {
  return (
    getEditorScore(tool) +
    Math.min(tool.features.length, 10) * 0.15 +
    Math.min(tool.integrations.length, 8) * 0.08 +
    (tool.platforms.includes("Desktop") ? 0.4 : 0) +
    (tool.difficultyLevel === "advanced" ? 0.15 : 0)
  );
}

function pickRecommendedTool(left: Tool, right: Tool) {
  return getMostTeamsScore(left) >= getMostTeamsScore(right) ? left : right;
}

function pickPowerTool(left: Tool, right: Tool) {
  return getPowerScore(left) >= getPowerScore(right) ? left : right;
}

function pickWinner(leftValue: number, rightValue: number, prefersLower = false) {
  if (leftValue === rightValue) return null;
  if (prefersLower) {
    return leftValue < rightValue ? "left" : "right";
  }
  return leftValue > rightValue ? "left" : "right";
}

function getPlatformLabel(tool: Tool) {
  return tool.platforms.join(", ") || "Pending";
}

function getMobileLabel(tool: Tool) {
  const mobile = tool.platforms.filter((platform) => platform === "iOS" || platform === "Android");
  if (mobile.length === 0) return "No mobile apps";
  return mobile.join(" + ");
}

function buildComparisonRows(left: Tool, right: Tool): ComparisonRow[] {
  return [
    {
      label: "Starting price",
      left: left.pricingRange || left.pricing,
      right: right.pricingRange || right.pricing,
      winner: pickWinner(getPricingRank(left), getPricingRank(right), true),
    },
    {
      label: "Free plan",
      left: left.hasFreePlan ? "Yes" : "No",
      right: right.hasFreePlan ? "Yes" : "No",
      winner:
        left.hasFreePlan === right.hasFreePlan
          ? null
          : left.hasFreePlan
            ? "left"
            : "right",
    },
    {
      label: "Feature depth",
      left: `${left.features.length} core features`,
      right: `${right.features.length} core features`,
      winner: pickWinner(left.features.length, right.features.length),
    },
    {
      label: "Integrations",
      left: left.integrations.length > 0 ? `${left.integrations.length} listed` : "Pending",
      right: right.integrations.length > 0 ? `${right.integrations.length} listed` : "Pending",
      winner: pickWinner(left.integrations.length, right.integrations.length),
    },
    {
      label: "Workflow breadth",
      left: `${left.useCases.length} use cases`,
      right: `${right.useCases.length} use cases`,
      winner: pickWinner(left.useCases.length, right.useCases.length),
    },
    {
      label: "Platform coverage",
      left: getPlatformLabel(left),
      right: getPlatformLabel(right),
      winner: pickWinner(left.platforms.length, right.platforms.length),
    },
    {
      label: "Mobile access",
      left: getMobileLabel(left),
      right: getMobileLabel(right),
      winner: pickWinner(getMobileCoverage(left), getMobileCoverage(right)),
    },
    {
      label: "Difficulty",
      left: left.difficulty,
      right: right.difficulty,
      winner: pickWinner(getDifficultyRank(left), getDifficultyRank(right), true),
    },
  ];
}

function buildChoiceReasons(tool: Tool, other: Tool) {
  const reasons = [
    tool.bestFor || tool.aiInsights?.bestFor || `Your workflow aligns with ${tool.name}'s strongest use cases.`,
  ];

  if (tool.hasFreePlan && !other.hasFreePlan) {
    reasons.push("You want a lower-risk entry point before committing budget.");
  }

  if (tool.features.length > other.features.length) {
    reasons.push("You need broader built-in feature depth for more advanced workflows.");
  }

  if (tool.integrations.length > other.integrations.length) {
    reasons.push("Native integrations matter because this tool connects to more of your stack.");
  }

  if (tool.platforms.includes("Desktop") && !other.platforms.includes("Desktop")) {
    reasons.push("Offline or desktop-heavy work is important to your team.");
  }

  if (getDifficultyRank(tool) < getDifficultyRank(other)) {
    reasons.push("Faster onboarding matters more than maximum customization.");
  }

  if (tool.teamFit.length > other.teamFit.length) {
    reasons.push("You need a tool that fits more team shapes without extra process overhead.");
  }

  return Array.from(new Set(reasons)).slice(0, 4);
}

function buildQuickTake(
  left: Tool,
  right: Tool,
  recommended: Tool,
  power: Tool,
  comparisonIntro?: string,
) {
  if (comparisonIntro) {
    return comparisonIntro;
  }

  const recommendedReason = recommended.hasFreePlan
    ? "free access and easier adoption"
    : "stronger day-to-day team fit";
  const powerReason =
    power.features.length >= Math.max(left.features.length, right.features.length)
      ? "feature depth and workflow flexibility"
      : power.platforms.includes("Desktop")
        ? "offline and desktop-heavy work"
        : "specialized workflow support";

  if (recommended.slug === power.slug) {
    return `${recommended.name} is the stronger overall pick here thanks to ${recommendedReason}. It also holds up well on ${powerReason}.`;
  }

  return `${recommended.name} wins for ${recommendedReason}. ${power.name} wins for ${powerReason}. The right pick depends on how your team actually works.`;
}

async function getRelatedComparisons(left: Tool, right: Tool): Promise<RelatedComparison[]> {
  const allTools = await listTools({ status: ["published"] });

  const candidates = allTools.filter(
    (tool) => tool.slug !== left.slug && tool.slug !== right.slug,
  );

  const entries = candidates.flatMap((candidate) => [
    {
      label: `${left.name} vs ${candidate.name}`,
      path: getComparisonPath(left.slug, candidate.slug),
      score: scoreComparisonPair(left, candidate),
    },
    {
      label: `${right.name} vs ${candidate.name}`,
      path: getComparisonPath(right.slug, candidate.slug),
      score: scoreComparisonPair(right, candidate),
    },
  ]);

  return Array.from(
    new Map(
      entries
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
        .map((entry) => [entry.path, entry]),
    ).values(),
  )
    .slice(0, 4)
    .map(({ label, path }) => ({ label, path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  const [tool1, tool2, relatedComparisons] = await Promise.all([
    getTool(comparison.toolA),
    getTool(comparison.toolB),
    (async () => {
      const current = await getComparisonBySlug(slug);
      if (!current) return [] as RelatedComparison[];
      const [left, right] = await Promise.all([getTool(current.toolA), getTool(current.toolB)]);
      if (!left || !right) return [] as RelatedComparison[];
      return getRelatedComparisons(left, right);
    })(),
  ]);

  if (!tool1 || !tool2) {
    notFound();
  }

  const recommendedTool = pickRecommendedTool(tool1, tool2);
  const powerTool = pickPowerTool(tool1, tool2);
  const comparisonRows = buildComparisonRows(tool1, tool2);
  const leftReasons = buildChoiceReasons(tool1, tool2);
  const rightReasons = buildChoiceReasons(tool2, tool1);
  const quickTake = buildQuickTake(tool1, tool2, recommendedTool, powerTool, comparison.intro);
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/tools?q=compare" },
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
    <div className="pb-24">
      <JsonLd data={serializeJsonLd(jsonLd)} />

      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-2 border-b border-border/80 bg-card px-4 py-3 text-sm text-muted-foreground sm:px-5">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/tools?q=compare" className="hover:text-primary">
            Compare
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">
            {tool1.name} vs {tool2.name}
          </span>
        </nav>

        <section className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Head-to-head comparison
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {tool1.name} vs {tool2.name}
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              A structured breakdown across pricing, features, collaboration, and use-case fit so you can decide without running a trial.
            </p>
          </div>
        </section>

        <section className="flex items-start gap-3 rounded-[1.25rem] border border-primary/20 bg-primary-soft px-4 py-4 text-sm leading-6 text-primary-soft-foreground">
          <Scale className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            <strong className="font-semibold">Quick take:</strong> {quickTake}
          </p>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          {[tool1, tool2].map((tool) => {
            const isWinner = tool.slug === recommendedTool.slug;
            return (
              <article
                key={tool.slug}
                className={cn(
                  "rounded-[1.5rem] border bg-card p-5",
                  isWinner ? "border-primary/40 ring-1 ring-primary/20" : "border-border",
                )}
              >
                {isWinner ? (
                  <div className="mb-3 inline-flex rounded-md bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-soft-foreground">
                    Recommended for most teams
                  </div>
                ) : null}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-primary-soft text-sm font-semibold text-primary">
                    {getInitials(tool.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-foreground">{tool.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{tool.category}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-semibold leading-none text-foreground">
                      {getEditorScore(tool).toFixed(1)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">/10</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {tool.shortDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      getPricingTone(tool.pricingModel, tool.pricing),
                    )}
                  >
                    {tool.pricing}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    {tool.pricingRange || "Pricing pending"}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    {tool.platforms.slice(0, 3).join(" · ") || "Platform pending"}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    {tool.difficulty}
                  </span>
                </div>

                <Link
                  href={`/tools/${tool.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[0.95rem] border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-muted hover:text-foreground"
                >
                  Full review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </section>

        <section className="rounded-[1.5rem] border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Feature comparison</h2>
          <p className="mt-2 text-xs text-muted-foreground sm:hidden">Scroll horizontally to see the full table.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[640px] w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Criteria
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {tool1.name}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {tool2.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-3 text-sm font-medium text-foreground">{row.label}</td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">
                      <span className={row.winner === "left" ? "font-medium text-success" : ""}>
                        {row.left}
                      </span>
                      {row.winner === "left" ? (
                        <span className="ml-2 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-success-soft-foreground">
                          winner
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">
                      <span className={row.winner === "right" ? "font-medium text-success" : ""}>
                        {row.right}
                      </span>
                      {row.winner === "right" ? (
                        <span className="ml-2 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-success-soft-foreground">
                          winner
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <article className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-[0.7rem] bg-primary-soft text-[11px] font-semibold text-primary">
                {getInitials(tool1.name)}
              </div>
              When to choose {tool1.name}
            </div>
            <div className="space-y-2.5">
              {leftReasons.map((reason) => (
                <div key={reason} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-[0.7rem] bg-primary-soft text-[11px] font-semibold text-primary">
                {getInitials(tool2.name)}
              </div>
              When to choose {tool2.name}
            </div>
            <div className="space-y-2.5">
              {rightReasons.map((reason) => (
                <div key={reason} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Final recommendation</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <article className="rounded-[1.25rem] border border-border bg-muted p-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Choose this if you need power
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">{powerTool.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {powerTool.features.length >= 6
                  ? `Best when you need broader feature depth, more built-in capability, and room for more complex workflows.`
                  : `Best when your team needs its specific strengths more than a general-purpose default pick.`}
              </p>
            </article>

            <article className="rounded-[1.25rem] border border-primary/30 bg-primary-soft p-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary-soft-foreground">
                Best for most teams
              </p>
              <h3 className="mt-2 text-base font-semibold text-primary-soft-foreground">
                {recommendedTool.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-primary-soft-foreground">
                {recommendedTool.hasFreePlan
                  ? `Lower adoption friction, easier trialing, and a friendlier default setup make this the better first choice for most teams.`
                  : `Stronger overall team fit and better day-to-day adoption make this the safer default recommendation.`}
              </p>
            </article>
          </div>
        </section>

        {relatedComparisons.length > 0 ? (
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">More comparisons</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Other head-to-heads people often check alongside this one.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedComparisons.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-[1.5rem] border border-border bg-muted px-5 py-6 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            Still not sure which one fits your workflow?
          </p>
          <Link
            href={`/tools/${recommendedTool.slug}`}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-[0.95rem] border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-background"
          >
            Review {recommendedTool.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
