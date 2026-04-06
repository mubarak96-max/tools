import type { ReactNode } from "react";
import Link from "next/link";

import { FREE_TOOLS } from "@/lib/tools/registry";

export default function FreeToolsLayout({ children }: { children: ReactNode }) {
  const groupedTools = FREE_TOOLS.reduce<Record<string, typeof FREE_TOOLS>>((groups, tool) => {
    groups[tool.category] = [...(groups[tool.category] || []), tool];
    return groups;
  }, {});

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
      <aside className="glass-card rounded-[1.75rem] border border-border/80 p-5 lg:sticky lg:top-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Free Tools
        </p>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          Calculators, converters, and focused utilities.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Explore SEO-ready tool pages with server-rendered content and lightweight interactive UI.
        </p>

        <nav aria-label="Free tools navigation" className="mt-6 space-y-5">
          {Object.entries(groupedTools).map(([category, tools]) => (
            <section key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {category}
              </h3>
              <ul className="mt-3 space-y-2">
                {tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="block rounded-[1rem] border border-border/70 bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </aside>

      <div>{children}</div>
    </div>
  );
}
