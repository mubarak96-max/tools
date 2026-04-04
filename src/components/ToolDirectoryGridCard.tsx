import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { getPricingTone } from '@/lib/ui';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/database';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ToolDirectoryGridCard({ tool }: { tool: Tool }) {
  const metaTags = [
    ...tool.useCases.slice(0, 2),
    ...(tool.platforms.length > 0 ? [tool.platforms.join(', ')] : []),
  ].slice(0, 4);

  return (
    <article className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-border bg-card p-5 transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-primary-soft text-xs font-semibold text-primary">
            {initials(tool.name)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground">{tool.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {tool.category} · {tool.difficulty}
            </p>
          </div>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
            getPricingTone(tool.pricingModel, tool.pricing),
          )}
        >
          {tool.pricing}
        </span>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {tool.shortDescription || tool.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {metaTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
        <strong className="font-medium text-foreground">Best for:</strong>{' '}
        {tool.bestFor || tool.aiInsights?.bestFor || 'General software evaluation and workflow fit.'}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-flex items-center rounded-[0.85rem] border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Read review
        </Link>
        {tool.website ? (
          <Link
            href={tool.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[0.85rem] border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
          >
            Visit site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
