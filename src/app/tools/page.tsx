import { Suspense } from 'react';

import ToolDirectoryGridCard from '@/components/ToolDirectoryGridCard';
import ToolsDirectoryClient from '@/components/ToolsDirectoryClient';
import { listTools } from '@/lib/db/tools';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = buildMetadata({
  title: 'All AI Tools & Software Directory (2026)',
  description:
    'Browse our complete directory of top-rated AI tools and software platforms.',
  path: '/tools',
});

function ToolsDirectoryFallback({
  tools,
}: {
  tools: Awaited<ReturnType<typeof listTools>>;
}) {
  return (
    <div className="animate-fade-in pb-20">
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Software directory</h1>
          <p className="text-sm text-muted-foreground">
            Browse and filter reviewed tools by category, pricing, and platform.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[220px] flex-1 rounded-[1rem] border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Loading search and filters...
          </div>
          <div className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Sort: A-Z
          </div>
          <span className="ml-auto text-sm text-muted-foreground">
            {tools.length} tool{tools.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-start gap-6">
          <aside className="hidden w-[210px] shrink-0 rounded-[1.5rem] border border-border bg-card p-5 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Filter
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Interactive filters are loading.</p>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {tools.map((tool) => (
                <ToolDirectoryGridCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </div>
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
