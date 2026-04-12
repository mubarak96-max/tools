import Link from "next/link";

import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import { FREE_TOOL_CATEGORY_ROUTES, FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

function ToolCard({ tool }: { tool: FreeToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 border-t border-border/60 py-5 transition-colors hover:text-primary"
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
    <div className="space-y-10 pb-4">
      <section className="space-y-6">
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


      </section>

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

      <section className="space-y-4 border-t border-border/60 pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Explore other tool categories</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(FREE_TOOL_CATEGORY_ROUTES) as [FreeToolMeta["category"], string][])
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
