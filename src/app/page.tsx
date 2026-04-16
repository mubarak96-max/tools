import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Calculator,
  FileText,
  Hammer,
  HeartPulse,
  ImageIcon,
  RefreshCw,
  Sparkles,
  Type,
  Wrench,
} from "lucide-react";

import { ToolSearch } from "@/components/home/ToolSearch";
import JsonLd from "@/components/seo/JsonLd";
import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import { absoluteUrl, buildMetadata, SITE_NAME } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { FREE_TOOL_CATEGORY_ROUTES, FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

export const revalidate = 1800;

const HOME_TITLE = "FindBest.tools | Free Online Tools & Calculators";
const HOME_DESCRIPTION =
  "Free online tools for text, images, PDFs, finance, real estate, health, and more. No sign-up required. Get fast results in your browser.";

const baseMetadata = buildMetadata({
  title: "Free Online Tools & Calculators",
  description: HOME_DESCRIPTION,
  path: "/",
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    absolute: HOME_TITLE,
  },
  keywords: [
    "free online tools",
    "online calculators",
    "salary calculator",
    "merge pdf",
    "image compressor",
    "text tools",
    "browser based tools",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absoluteUrl("/"),
  },
  twitter: {
    ...baseMetadata.twitter,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

const MOST_USED_TOOL_HREFS = [
  "/finance/salary-calculator",
  "/pdf/merge-pdf",
  "/image/image-compressor",
  "/finance/mortgage-calculator",
  "/text/convert-image-to-text",
  "/utility/xg-expected-goals-calculator",
  "/ai/ai-humanizer",
  "/utility/free-cv-resume-builder",
];

const FEATURED_TOOL_HREFS = [
  "/finance/salary-calculator",
  "/finance/mortgage-calculator",
  "/pdf/merge-pdf",
  "/image/image-compressor",
];

const CATEGORY_ORDER = [
  "Finance",
  "Text",
  "Image",
  "PDF",
  "Health",
  "Real Estate",
  "Utility",
  "Converter",
  "Tailwind",
  "AI",
  "Construction",
] as const;

type HomeCategory = (typeof CATEGORY_ORDER)[number];

const CATEGORY_META: Record<
  HomeCategory,
  {
    heading: string;
    description: string;
    browseLabel: string;
    ctaLabel: string;
    ctaHref: string;
    icon: LucideIcon;
    navTag?: string;
  }
> = {
  Finance: {
    heading: "Finance calculators for salary, loans, tax, and pricing.",
    description:
      "Salary, mortgage, tax, and pricing calculators built for clear inputs and fast answers.",
    browseLabel: "View all finance calculators",
    ctaLabel: "Calculate your salary",
    ctaHref: "/finance/salary-calculator",
    icon: Calculator,
    navTag: "Popular",
  },
  Text: {
    heading: "Text tools for cleanup, analysis, and conversion.",
    description:
      "Transform, analyze, and clean up text for writing, SEO, social posts, and developer workflows.",
    browseLabel: "View all text tools",
    ctaLabel: "Start analyzing text",
    ctaHref: "/text/character-counter",
    icon: Type,
    navTag: "Popular",
  },
  Image: {
    heading: "Image tools for compression, conversion, and quick edits.",
    description:
      "Compress, convert, crop, and clean up images in the browser without slowing down your workflow.",
    browseLabel: "View all image tools",
    ctaLabel: "Compress an image",
    ctaHref: "/image/image-compressor",
    icon: ImageIcon,
    navTag: "Popular",
  },
  PDF: {
    heading: "PDF tools for merging, converting, and document cleanup.",
    description:
      "Merge, split, convert, and tidy documents directly in the browser for quick document work.",
    browseLabel: "View all PDF tools",
    ctaLabel: "Merge PDF files",
    ctaHref: "/pdf/merge-pdf",
    icon: FileText,
  },
  Health: {
    heading: "Health calculators for planning, pacing, and body metrics.",
    description:
      "Health and fitness calculators for calories, pace, body metrics, hydration, and daily planning.",
    browseLabel: "View all health tools",
    ctaLabel: "Estimate calories",
    ctaHref: "/health/calorie-calculator",
    icon: HeartPulse,
  },
  "Real Estate": {
    heading: "Real estate calculators for buying, renting, and property costs.",
    description:
      "Property calculators for rent, affordability, stamp duty, cash flow, and ownership decisions.",
    browseLabel: "View all real estate tools",
    ctaLabel: "Compare rent vs buy",
    ctaHref: "/real-estate/rent-vs-buy-calculator",
    icon: Building2,
  },
  Utility: {
    heading: "Utility tools for productivity, setup, and everyday browser tasks.",
    description:
      "General-purpose browser tools for productivity, SEO setup, codes, IDs, timers, and everyday tasks.",
    browseLabel: "View all utility tools",
    ctaLabel: "Build a CV",
    ctaHref: "/utility/free-cv-resume-builder",
    icon: Wrench,
  },
  Converter: {
    heading: "Converter tools for units, encodings, and data cleanup.",
    description:
      "Fast unit, encoding, and data converters for browser-based cleanup and developer workflows.",
    browseLabel: "View all converter tools",
    ctaLabel: "Open a converter",
    ctaHref: "/converter/convert-length-converter",
    icon: RefreshCw,
  },
  Tailwind: {
    heading: "Tailwind generators for UI building blocks and layout scaffolding.",
    description:
      "Tailwind builders and generators for buttons, cards, colors, grids, gradients, and layout scaffolding.",
    browseLabel: "View all Tailwind tools",
    ctaLabel: "Generate a button",
    ctaHref: "/tailwind/button-generator",
    icon: Sparkles,
  },
  AI: {
    heading: "AI tools for rewriting and lightweight content workflows.",
    description:
      "AI helpers for rewriting and lightweight workflows where you need a faster draft or cleaner output.",
    browseLabel: "View all AI tools",
    ctaLabel: "Open AI Humanizer",
    ctaHref: "/ai/ai-humanizer",
    icon: BrainCircuit,
  },
  Construction: {
    heading: "Construction calculators for materials, dimensions, and site planning.",
    description:
      "Practical construction calculators for concrete, flooring, roofing, paint, stairs, and material planning.",
    browseLabel: "View all construction tools",
    ctaLabel: "Calculate concrete volume",
    ctaHref: "/construction/concrete-volume-calculator",
    icon: Hammer,
  },
};

const HERO_TRUST_ITEMS = [
  {
    title: "Free tools",
    copy: "Useful utilities across text, PDFs, images, finance, and more.",
  },
  {
    title: "No sign-up",
    copy: "Open a tool and get to work without a gated flow.",
  },
  {
    title: "Fast results",
    copy: "Built for quick answers when you do not want extra software.",
  },
  {
    title: "Browser-based",
    copy: "Designed for desktop and mobile without extra installs.",
  },
] as const;

function buildHomeOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: HOME_DESCRIPTION,
  };
}

function ToolCard({ tool }: { tool: FreeToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col rounded-[1.5rem] border border-border/80 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_44px_-30px_rgba(79,70,229,0.45)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="primary-chip inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
          {tool.category}
        </span>
        <div className="shrink-0 rounded-xl border border-border bg-muted p-2.5">
          <FreeToolIcon tool={tool} size={18} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
        Open tool
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function CategoryNavItem({
  category,
  count,
}: {
  category: HomeCategory;
  count: number;
}) {
  const { icon: Icon, navTag } = CATEGORY_META[category];

  return (
    <Link
      href={FREE_TOOL_CATEGORY_ROUTES[category]}
      className="group flex min-w-max items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
    >
      <Icon className="h-4 w-4" />
      <span>{category}</span>
      <span className="text-xs text-muted-foreground group-hover:text-primary/80">({count})</span>
      {navTag ? (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          {navTag}
        </span>
      ) : null}
    </Link>
  );
}

function CategorySection({
  category,
  href,
  tools,
}: {
  category: HomeCategory;
  href: string;
  tools: FreeToolMeta[];
}) {
  const visible = tools.slice(0, 8);
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;

  return (
    <section className="rounded-[2rem] border border-border/70 bg-card px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            <Icon className="h-3.5 w-3.5" />
            {category} · {tools.length} tools
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {meta.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{meta.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={meta.ctaHref}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {meta.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            {meta.browseLabel} ({tools.length})
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const toolCount = FREE_TOOLS.length;
  const mostUsedTools = MOST_USED_TOOL_HREFS.map((href) =>
    FREE_TOOLS.find((tool) => tool.href === href),
  ).filter((tool): tool is FreeToolMeta => Boolean(tool));

  const featuredTools = FEATURED_TOOL_HREFS.map((href) =>
    FREE_TOOLS.find((tool) => tool.href === href),
  ).filter((tool): tool is FreeToolMeta => Boolean(tool));

  const groupedTools = FREE_TOOLS.reduce<Record<string, typeof FREE_TOOLS>>((groups, tool) => {
    groups[tool.category] = [...(groups[tool.category] || []), tool];
    return groups;
  }, {});

  const orderedCategories = CATEGORY_ORDER.map((category) => ({
    category,
    href: FREE_TOOL_CATEGORY_ROUTES[category],
    tools: groupedTools[category] ?? [],
  })).filter((entry) => entry.tools.length > 0);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]);
  const featuredToolsJsonLd = buildItemListJsonLd(
    featuredTools.map((tool) => ({ name: tool.name, path: tool.href })),
    "Featured tools",
  );
  const mostUsedToolsJsonLd = buildItemListJsonLd(
    mostUsedTools.map((tool) => ({ name: tool.name, path: tool.href })),
    "Popular tools",
  );

  return (
    <div className="space-y-10 pb-16 sm:space-y-12">
      <JsonLd data={serializeJsonLd(buildHomeOrganizationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbJsonLd)} />
      <JsonLd data={serializeJsonLd(featuredToolsJsonLd)} />
      <JsonLd data={serializeJsonLd(mostUsedToolsJsonLd)} />

      <section className="rounded-[2rem] border border-border/70 bg-card px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
          <div>
            <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              {toolCount}+ browser-based tools
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {toolCount}+ free tools for text, PDFs, images, and calculators.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Solve practical problems fast, from salary calculations to PDF cleanup to image
              compression. Open a tool, get the answer, and keep moving.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#featured-tools"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Browse featured tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/finance/salary-calculator"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                Start with salary calculator
              </Link>
            </div>

            <ToolSearch />

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {HERO_TRUST_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] border border-border/70 bg-background px-4 py-4"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-background p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <Image
                src="/images/logo.svg"
                alt="FindBest Tools"
                width={182}
                height={42}
                className="h-9 w-auto"
              />
              <span className="primary-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                Popular workflows
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-border/70 bg-card px-4 py-3 transition-colors hover:border-primary/20 hover:bg-primary-soft"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.category}</p>
                  </div>
                  <div className="shrink-0 rounded-xl border border-border bg-muted p-2.5">
                    <FreeToolIcon tool={tool} size={18} />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-border/70 bg-card px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Top categories
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">Finance, Text, and Image</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  High-intent tools up front so the homepage gets to useful work quickly.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border/70 bg-card px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Fast entry points
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">Search or jump by category</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Browse by intent, not by endless scrolling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[4.75rem] z-20 -mx-4 border-y border-border/70 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto">
          {orderedCategories.map((entry) => (
            <CategoryNavItem
              key={entry.category}
              category={entry.category}
              count={entry.tools.length}
            />
          ))}
        </div>
      </section>

      <section id="featured-tools" className="rounded-[2rem] border border-border/70 bg-card px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Featured tools
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              High-value tools people usually want first.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              These entry points cover salary calculations, mortgage planning, PDF merging, and
              image compression without making you hunt through the full directory.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Popular tools
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Strong starting points across the site.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              A broader mix of utilities across finance, PDFs, images, AI, and productivity so the
              homepage does not repeat the same text tools everywhere.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mostUsedTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      {orderedCategories.map((entry) => (
        <CategorySection
          key={entry.category}
          category={entry.category}
          href={entry.href}
          tools={entry.tools}
        />
      ))}
    </div>
  );
}
