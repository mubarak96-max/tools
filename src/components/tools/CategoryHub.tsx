import Link from "next/link";

import { FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

function ToolCard({ tool }: { tool: FreeToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="glass-card rounded-[1.5rem] border border-border/80 p-6 transition-colors hover:border-primary/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full border border-primary/10 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {tool.category}
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{tool.name}</h2>
        </div>
        {tool.icon ? (
          <span className="rounded-[0.9rem] border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground">
            {tool.icon}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{tool.description}</p>
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

  return (
    <div className="space-y-10">
      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Category hub
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{category}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Live tools</h2>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            {tools.length} live
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
