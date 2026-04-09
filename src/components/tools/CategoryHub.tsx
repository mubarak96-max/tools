import Link from "next/link";

import { FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

const CATEGORY_ROUTE_MAP: Record<FreeToolMeta["category"], string> = {
  Text: "/text",
  Image: "/image",
  PDF: "/pdf",
  Finance: "/finance",
  Tailwind: "/tailwind",
  Converter: "/converter",
  Utility: "/utility",
  AI: "/ai",
};

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
        {tool.icon ? (
          <span className="shrink-0 rounded-lg border border-border bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
            {tool.icon}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </span>
    </Link>
  );
}

export default function CategoryHub({
  category,
  title,
  description,
}: {
  category: FreeToolMeta["category"];
  title: string;
  description: string;
}) {
  const tools = FREE_TOOLS.filter((tool) => tool.category === category);
  const categoryHref = CATEGORY_ROUTE_MAP[category];

  return (
    <div className="space-y-10 pb-4">
      {/* Page header */}
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{category} Tools</li>
          </ol>
        </nav>

        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          {category} · {tools.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>

        {/* Trust note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/25 bg-success-soft px-4 py-3 max-w-xl">
          <span className="mt-0.5 text-base leading-none">🔒</span>
          <p className="text-sm leading-6 text-success-soft-foreground">
            <strong className="font-semibold">Private by design.</strong>{" "}
            All processing runs in your browser — files never leave your device.
          </p>
        </div>
      </section>

      {/* Tool grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All {category} Tools
            <span className="ml-2 text-sm font-normal text-muted-foreground">({tools.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      {/* Cross-category discovery */}
      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Explore other tool categories</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CATEGORY_ROUTE_MAP) as [FreeToolMeta["category"], string][])
            .filter(([cat]) => cat !== category)
            .map(([cat, href]) => (
              <Link
                key={cat}
                href={href}
                className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                {cat}
              </Link>
            ))}

        </div>
      </section>
    </div>
  );
}
