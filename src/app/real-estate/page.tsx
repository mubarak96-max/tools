import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Real Estate Calculators for Rent, Yield, ROI, and Buying Costs",
  description:
    "Use real-estate calculators for rental yield, cap rate, rent affordability, closing costs, rent vs buy, and price per square foot.",
  path: "/real-estate",
});

const REAL_ESTATE_TOOLS = FREE_TOOLS.filter((tool) => tool.category === "Real Estate");

function ToolCard({ tool }: { tool: FreeToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary leading-snug">
          {tool.name}
        </h2>
        {tool.icon ? (
          <span className="shrink-0 rounded-lg border border-border bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
            {tool.icon}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{tool.description}</p>
    </Link>
  );
}

export default function RealEstatePage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Real Estate Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Real Estate · {REAL_ESTATE_TOOLS.length} calculators
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Real-estate calculators built for property decisions, not spreadsheet cleanup.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Compare renting and buying, estimate yield and cap rate, budget for closing costs, and work through property numbers with standalone calculators.
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Real-Estate Calculators
            <span className="ml-2 text-sm font-normal text-muted-foreground">({REAL_ESTATE_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {REAL_ESTATE_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
