'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Compass, Search } from 'lucide-react';

import ToolDirectoryRow from '@/components/ToolDirectoryRow';
import type { Tool } from '@/types/database';

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
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  );
}

export default function ToolsDirectoryClient({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get('q')?.trim() || '';
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

  const topCategories = useMemo(
    () =>
      [...filteredTools.reduce((map, tool) => {
        map.set(tool.category, (map.get(tool.category) ?? 0) + 1);
        return map;
      }, new Map<string, number>()).entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, 5),
    [filteredTools],
  );

  const quickQueries = useMemo(
    () => uniqueSorted(filteredTools.flatMap((tool) => tool.useCases)).slice(0, 6),
    [filteredTools],
  );

  const freeToolsCount = useMemo(
    () =>
      filteredTools.filter(
        (tool) => tool.pricingModel === 'free' || tool.pricingModel === 'freemium',
      ).length,
    [filteredTools],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      const trimmed = draftQuery.trim();

      if (trimmed) {
        nextParams.set('q', trimmed);
      } else {
        nextParams.delete('q');
      }

      router.replace(nextParams.size > 0 ? `${pathname}?${nextParams}` : pathname);
    });
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <main className="space-y-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Directory</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">All tools</span>
          </nav>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl space-y-4">
                  <div className="primary-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                    <Compass className="h-4 w-4" />
                    Software Directory
                  </div>
                  <div className="space-y-3">
                    <h1 className="section-heading text-4xl text-foreground md:text-5xl">
                      Browse software in a review-first format.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                      Search the live directory across tool names, pricing, platforms,
                      features, and use cases without leaving the current page structure.
                    </p>
                  </div>
                </div>

                <div className="grid shrink-0 gap-3 sm:grid-cols-3 lg:w-[17rem] lg:grid-cols-1">
                  <div className="rounded-[1rem] border border-border/80 bg-background/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Results
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{filteredTools.length}</p>
                  </div>
                  <div className="rounded-[1rem] border border-border/80 bg-background/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Categories
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{topCategories.length}</p>
                  </div>
                  <div className="rounded-[1rem] border border-border/80 bg-background/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Free or Freemium
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{freeToolsCount}</p>
                  </div>
                </div>
              </div>

              <form
                action="/tools"
                onSubmit={handleSubmit}
                className="glass flex flex-col gap-4 rounded-[1.4rem] border border-border/80 p-4 md:flex-row md:items-center"
              >
                <div className="surface-outline flex flex-1 items-center gap-3 rounded-[1rem] bg-background/80 px-4 py-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="search"
                    name="q"
                    value={draftQuery}
                    onChange={(event) => setDraftQuery(event.target.value)}
                    placeholder="Search by tool, pricing, use case, or platform"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-[1rem] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {isPending ? 'Updating...' : 'Search directory'}
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {quickQueries.map((query) => (
                  <Link
                    key={query}
                    href={`/tools?q=${encodeURIComponent(query)}`}
                    className="muted-chip rounded-full px-3 py-1.5 text-xs hover:border-primary/20 hover:text-primary"
                  >
                    {query}
                  </Link>
                ))}
                {quickQueries.length === 0 ? (
                  <span className="slate-chip rounded-full px-3 py-1.5 text-xs">
                    Search to narrow the directory
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => <ToolDirectoryRow key={tool.slug} tool={tool} />)
            ) : (
              <div className="glass-card rounded-[1.75rem] border border-border/80 p-12 text-center">
                <h2 className="text-2xl font-semibold text-foreground">No matching tools found.</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Try a broader term like free, AI writing, project management, or desktop.
                </p>
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Directory snapshot
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Published tools</span>
                <span className="font-medium text-foreground">{tools.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Visible results</span>
                <span className="font-medium text-foreground">{filteredTools.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 text-sm">
                <span className="text-muted-foreground">Free or freemium</span>
                <span className="font-medium text-foreground">{freeToolsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Top categories</span>
                <span className="font-medium text-foreground">{topCategories.length}</span>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Browse categories
            </p>
            <div className="mt-4 space-y-3">
              {topCategories.map(([category, count]) => (
                <Link
                  key={category}
                  href={`/tools?q=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between rounded-[1rem] border border-border/70 bg-background/70 px-4 py-3 text-sm hover:border-primary/20"
                >
                  <span className="text-foreground">{category}</span>
                  <span className="text-muted-foreground">{count}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Search guidance
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <p>Search supports tool names, pricing terms, platforms, feature names, and use cases.</p>
              <p>
                Examples: <code>freemium</code>, <code>Windows</code>, <code>AI Writing</code>,
                {' '}or <code>task tracking</code>.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
