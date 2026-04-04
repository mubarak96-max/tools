'use client';

import Link from 'next/link';
import { Tool } from '@/types/database';
import { BadgeCheck, ArrowRight, Zap } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="glass-card group flex h-full flex-col rounded-[1.75rem] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="muted-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {tool.category}
            </span>
            <span className="muted-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {tool.status}
            </span>
          </div>
          <h3 className="flex items-center gap-2 text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {tool.name}
            {tool.aiInsights && (
              <span title="AI Analyzed" className="inline-flex">
                <BadgeCheck className="w-4 h-4 text-primary" />
              </span>
            )}
          </h3>
        </div>
        <div className="rounded-2xl bg-secondary px-4 py-3 text-right text-secondary-foreground shadow-lg shadow-secondary/10">
          <span className="text-sm font-semibold">{tool.pricing}</span>
          <p className="mt-1 text-xs text-secondary-foreground/70">{tool.pricingRange}</p>
        </div>
      </div>

      <p className="mb-6 flex-grow text-sm leading-6 text-muted-foreground line-clamp-3">
        {tool.shortDescription || tool.description}
      </p>

      {tool.aiInsights?.whyThisToolFits && (
        <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/6 p-4">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm italic leading-6 text-primary/90 line-clamp-2">{tool.aiInsights.whyThisToolFits}</p>
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
        <div className="flex flex-wrap gap-2">
          {tool.useCases?.slice(0, 2).map((useCase) => (
            <span key={useCase} className="muted-chip rounded-md px-2.5 py-1 text-xs">
              {useCase}
            </span>
          ))}
          {tool.useCases && tool.useCases.length > 2 && (
            <span className="muted-chip rounded-md px-2.5 py-1 text-xs">
              +{tool.useCases.length - 2}
            </span>
          )}
        </div>
        
        <Link 
          href={`/tools/${tool.slug}`}
          className="ml-4 inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
        >
          Review
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
