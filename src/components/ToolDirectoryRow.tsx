import Link from 'next/link';
import { ArrowRight, BadgeCheck, Globe, Zap } from 'lucide-react';

import { getPricingTone, getWorkflowStatusTone } from '@/lib/ui';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/database';

function scoreLabel(tool: Tool) {
  return Math.round((tool.sourceConfidence ?? 0.8) * 100);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ToolDirectoryRow({ tool }: { tool: Tool }) {
  const confidence = scoreLabel(tool);
  const detailLine = [
    tool.pricingRange || 'Pricing snapshot pending',
    tool.platforms.slice(0, 3).join(', ') || 'Platform details pending',
    tool.difficulty || 'Intermediate',
  ].join(' · ');

  return (
    <article className="border-t border-border/60 py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-1 gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.1rem] border border-primary/15 bg-primary-soft text-lg font-semibold text-primary">
            {initials(tool.name)}
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="primary-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                {tool.category}
              </span>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                  getPricingTone(tool.pricingModel, tool.pricing),
                )}
              >
                {tool.pricing}
              </span>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                  getWorkflowStatusTone(tool.status),
                )}
              >
                {tool.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{tool.name}</h2>
                {tool.aiInsights ? <BadgeCheck className="h-4 w-4 text-success" /> : null}
              </div>
              <p className="text-sm text-muted-foreground">{detailLine}</p>
            </div>

            <p className="text-sm leading-7 text-slate-700">
              {tool.shortDescription || tool.description}
            </p>

            {tool.aiInsights?.whyThisToolFits ? (
              <div className="border-l-2 border-success/30 pl-4">
                <div className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <p className="text-sm leading-6 text-success-soft-foreground">
                    {tool.aiInsights.whyThisToolFits}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {tool.useCases.slice(0, 4).map((useCase) => (
                <span key={useCase} className="muted-chip rounded-full px-3 py-1 text-xs">
                  {useCase}
                </span>
              ))}
              {tool.useCases.length > 4 ? (
                <span className="muted-chip rounded-full px-3 py-1 text-xs">
                  +{tool.useCases.length - 4} more
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              >
                Read review
                <ArrowRight className="h-4 w-4" />
              </Link>
              {tool.website ? (
                <Link
                  href={tool.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-primary/20 hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                  Visit site
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="grid shrink-0 gap-4 border-t border-border/60 pt-4 sm:grid-cols-3 lg:w-52 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success-soft-foreground">
              Confidence
            </p>
            <p className="mt-2 text-3xl font-semibold text-success">{confidence}</p>
            <p className="text-xs text-success-soft-foreground">out of 100</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Best for
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {tool.bestFor || tool.aiInsights?.bestFor || tool.audiences.slice(0, 2).join(', ') || 'General workflows'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Team fit
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {tool.teamFit.slice(0, 2).join(', ') || 'Solo and small teams'}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
