import { Compass } from 'lucide-react';
import { Suspense } from 'react';

import ToolDirectoryRow from '@/components/ToolDirectoryRow';
import ToolsDirectoryClient from '@/components/ToolsDirectoryClient';
import { listTools } from '@/lib/db/tools';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = buildMetadata({
  title: 'All AI Tools & Software Directory (2026)',
  description:
    'Browse our complete directory of top-rated AI tools and software platforms, thoroughly analyzed by AI.',
  path: '/tools',
});

function ToolsDirectoryFallback({
  tools,
}: {
  tools: Awaited<ReturnType<typeof listTools>>;
}) {
  const categoryCount = new Set(tools.map((tool) => tool.category)).size;
  const freeToolsCount = tools.filter(
    (tool) => tool.pricingModel === 'free' || tool.pricingModel === 'freemium',
  ).length;

  return (
    <div className="animate-fade-in pb-24">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <main className="space-y-6">
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
                      features, and use cases without changing the underlying behavior.
                    </p>
                  </div>
                </div>

                <div className="grid shrink-0 gap-3 sm:grid-cols-3 lg:w-[17rem] lg:grid-cols-1">
                  <div className="rounded-[1rem] border border-border/80 bg-background/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Results
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{tools.length}</p>
                  </div>
                  <div className="rounded-[1rem] border border-border/80 bg-background/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Categories
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{categoryCount}</p>
                  </div>
                  <div className="rounded-[1rem] border border-border/80 bg-background/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Free or Freemium
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{freeToolsCount}</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-[1.4rem] border border-border/80 p-4 text-sm text-slate-700">
                Loading the interactive search controls. The directory results below are already available.
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {tools.map((tool) => (
              <ToolDirectoryRow key={tool.slug} tool={tool} />
            ))}
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
                <span className="text-muted-foreground">Visible in fallback</span>
                <span className="font-medium text-foreground">{tools.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Interactive search</span>
                <span className="font-medium text-foreground">Loading</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default async function AllToolsPage() {
  const tools = await listTools({ status: ['published'] });

  return (
    <Suspense fallback={<ToolsDirectoryFallback tools={tools} />}>
      <ToolsDirectoryClient tools={tools} />
    </Suspense>
  );
}
