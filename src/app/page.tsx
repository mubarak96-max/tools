import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

export const revalidate = 1800;

export const metadata = buildMetadata({
  title: "Utility Tools for Text, Image, Finance, Tailwind, and AI Workflows",
  description:
    "Browser-based utility tools for text cleanup, image editing, Tailwind CSS generation, finance calculations, OCR, and AI workflows. No sign-up, no uploads.",
  path: "/",
});

const MOST_USED_TOOL_HREFS = [
  "/text/convert-image-to-text",
  "/pdf/merge-pdf",
  "/image/convert-image-to-base64",
  "/text/ascii-art-generator",
  "/text/character-counter",
  "/text/case-converter",
  "/image/flip-image-online",
  "/finance/salary-calculator",
];

const CATEGORY_ORDER = ["Text", "Image", "PDF", "Finance", "Tailwind", "Converter", "Utility", "AI"] as const;

const CATEGORY_ROUTES: Record<string, string> = {
  Text: "/text",
  Image: "/image",
  PDF: "/pdf",
  Finance: "/finance",
  Tailwind: "/tailwind",
  Converter: "/converter",
  Utility: "/utility",
  AI: "/ai",
};

const TRUST_ITEMS = [
  { icon: "⚡", label: "Instant results" },
  { icon: "🔒", label: "Files stay on your device" },
  { icon: "🚫", label: "No sign-up required" },
  { icon: "🆓", label: "Free forever" },
  { icon: "🌐", label: "Works in any browser" },
];

function ToolCard({
  name,
  href,
  description,
  icon,
}: {
  name: string;
  href: string;
  description: string;
  icon?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 border-t border-border/60 py-5 transition-colors hover:text-primary"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {name}
        </h3>
        {icon ? (
          <span className="shrink-0 rounded-lg border border-border bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </span>
    </Link>
  );
}

function CategorySection({
  category,
  href,
  tools,
}: {
  category: string;
  href: string;
  tools: FreeToolMeta[];
}) {
  const visible = tools.slice(0, 8);
  const hasMore = tools.length > 8;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link href={href} className="group flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {category} Tools
          </h2>
          <span className="text-xs text-muted-foreground">({tools.length})</span>
        </Link>
        {hasMore && (
          <Link
            href={href}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary"
          >
            Browse all →
          </Link>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((tool) => (
          <ToolCard
            key={tool.href}
            name={tool.name}
            href={tool.href}
            description={tool.description}
            icon={tool.icon}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const mostUsedTools = MOST_USED_TOOL_HREFS.map((href) =>
    FREE_TOOLS.find((tool) => tool.href === href)
  ).filter((tool): tool is FreeToolMeta => Boolean(tool));

  const groupedTools = FREE_TOOLS.reduce<Record<string, typeof FREE_TOOLS>>((groups, tool) => {
    groups[tool.category] = [...(groups[tool.category] || []), tool];
    return groups;
  }, {});

  const orderedCategories = CATEGORY_ORDER.map((category) => ({
    category,
    href: CATEGORY_ROUTES[category],
    tools: groupedTools[category] ?? [],
  })).filter((entry) => entry.tools.length > 0);

  return (
    <div className="space-y-14 pb-16">

      {/* ── Hero ── */}
      <section className="py-8 text-center">

        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Find the right tool —{" "}
          <span className="text-gradient-primary">instantly.</span>
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-base leading-7 text-muted-foreground sm:text-lg">
          Practical utilities for text, images, PDFs, finance calculations, and AI workflows.
          Everything runs in your browser — your files never leave your device.
        </p>

        {/* Category pill shortcuts */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORY_ORDER.map((cat) => (
            <Link
              key={cat}
              href={CATEGORY_ROUTES[cat]}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary hover:bg-primary-soft"
            >
              {cat}
            </Link>
          ))}

        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2.5">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Most Used ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Most Used</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {mostUsedTools.map((tool) => (
            <ToolCard
              key={tool.href}
              name={tool.name}
              href={tool.href}
              description={tool.description}
              icon={tool.icon}
            />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
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
