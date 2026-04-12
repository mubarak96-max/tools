import Link from "next/link";

import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import { buildMetadata } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";
import {
  WORD_COUNTER_HUB_PATH,
  WORD_COUNTER_LANDINGS_ANCHOR_ID,
  getWordCounterLandingNavHighlights,
  getWordCounterLandingNavItems,
} from "@/lib/word-counter-landings/registry";
import type { FreeToolMeta } from "@/types/tools";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Text Tools for Analysis, Conversion, and Cleanup",
  description:
    "Free text tools for character counting, case conversion, word frequency, Morse code, binary translation, ASCII art, and more.",
  path: "/text",
});

const TEXT_TOOLS = FREE_TOOLS.filter((tool) => tool.category === "Text");

function ToolCard({ tool }: { tool: FreeToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {tool.name}
        </h2>
        <div className="shrink-0 rounded-lg border border-border bg-muted p-2">
          <FreeToolIcon tool={tool} size={18} />
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </span>
    </Link>
  );
}

const highlightSet = new Set(getWordCounterLandingNavHighlights().map((item) => item.slug));

export default function TextPage() {
  const navHighlights = getWordCounterLandingNavHighlights();
  const navRest = getWordCounterLandingNavItems().filter((item) => !highlightSet.has(item.slug));

  return (
    <div className="space-y-10 pb-4">
      {/* Header */}
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Text Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Text · {TEXT_TOOLS.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Text tools for quick analysis, cleanup, and conversion.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Focused utilities for analyzing copy, converting case, counting characters, and transforming text — all browser-based with no sign-up needed.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          Need word limits, reading time, or audience-specific guides? Jump to{" "}
          <Link href={`#${WORD_COUNTER_LANDINGS_ANCHOR_ID}`} className="font-medium text-primary hover:underline">
            word and character entry points
          </Link>{" "}
          below, or open the neutral{" "}
          <Link href={WORD_COUNTER_HUB_PATH} className="font-medium text-primary hover:underline">
            character counter
          </Link>
          .
        </p>
      </section>

      <section
        id={WORD_COUNTER_LANDINGS_ANCHOR_ID}
        className="scroll-mt-8 rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8"
      >
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Word, character, and reading-time entry points</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          These pages share the same live counter with different titles, FAQs, and examples so you can land on the intent that matches your search—essays, SEO, limits, or “how many words is…”.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          <Link href={WORD_COUNTER_HUB_PATH} className="font-medium text-primary hover:underline">
            Character counter hub
          </Link>{" "}
          keeps neutral copy; the links here add context for specific workflows.
        </p>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Popular</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {navHighlights.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-primary-soft hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <details className="mt-8 rounded-[1.25rem] border border-border bg-background p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Show all entry points ({navRest.length} more)
          </summary>
          <div className="mt-4 flex max-h-[min(24rem,55vh)] flex-wrap gap-2 overflow-y-auto pr-1">
            {navRest.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </details>
      </section>

      {/* Tool grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Text Tools
            <span className="ml-2 text-sm font-normal text-muted-foreground">({TEXT_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TEXT_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      {/* Cross-category */}
      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Finance Tools", href: "/finance" },
            { label: "Image Tools", href: "/image" },
            { label: "PDF Tools", href: "/pdf" },
            { label: "AI Tools", href: "/ai" },
            { label: "Converter Tools", href: "/converter" },
            { label: "Tailwind Tools", href: "/tailwind" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

        </div>
      </section>
    </div>
  );
}
