'use client';

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/types/database";

function matchesQuery(tool: Tool, query: string) {
  const haystack = [
    tool.name,
    tool.category,
    tool.shortDescription,
    tool.pricing,
    tool.pricingRange,
    ...tool.useCases,
    ...tool.features,
    ...tool.platforms,
    ...tool.integrations,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function ToolsDirectoryClient({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() || "";
  const [draftQuery, setDraftQuery] = useState(queryFromUrl);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(queryFromUrl);

  useEffect(() => {
    setDraftQuery(queryFromUrl);
  }, [queryFromUrl]);

  const filteredTools = useMemo(() => {
    if (!deferredQuery) {
      return tools;
    }

    return tools.filter((tool) => matchesQuery(tool, deferredQuery));
  }, [deferredQuery, tools]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      const trimmed = draftQuery.trim();

      if (trimmed) {
        nextParams.set("q", trimmed);
      } else {
        nextParams.delete("q");
      }

      router.replace(nextParams.size > 0 ? `${pathname}?${nextParams}` : pathname);
    });
  }

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-10 sm:px-8 md:px-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(24,70,133,0.12),transparent_55%)] lg:block" />
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Software Directory
          </div>
          <h1 className="section-heading text-4xl text-foreground md:text-6xl">
            Explore tools by fit, not just by name.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Search the live directory across tool names, pricing, platforms, features, and use cases.
          </p>

          <form
            action="/tools"
            onSubmit={handleSubmit}
            className="glass flex flex-col gap-4 rounded-[1.75rem] p-4 md:flex-row md:items-center"
          >
            <input
              type="search"
              name="q"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              placeholder="Search by tool, pricing, use case, or platform"
              className="surface-outline w-full flex-1 rounded-[1.25rem] bg-background/70 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-[1.25rem] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isPending ? "Updating..." : "Search"}
            </button>
          </form>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{filteredTools.length} results</span>
            {queryFromUrl ? (
              <span>
                for <strong className="text-foreground">{queryFromUrl}</strong>
              </span>
            ) : (
              <span>across all published tools</span>
            )}
          </div>
        </div>
      </section>

      <section>
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[1.75rem] p-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">No matching tools found.</h3>
            <p className="text-muted-foreground">
              Try a broader term like free, AI, project management, or desktop.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
