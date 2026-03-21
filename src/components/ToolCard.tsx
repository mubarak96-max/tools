import Link from 'next/link';
import { Tool } from '@/types/database';
import { BadgeCheck, ArrowRight, Zap } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
            {tool.name}
            {tool.aiInsights && (
              <span title="AI Analyzed" className="inline-flex">
                <BadgeCheck className="w-4 h-4 text-primary" />
              </span>
            )}
          </h3>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground inline-block mt-2">
            {tool.category}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-foreground">{tool.pricing}</span>
          <p className="text-xs text-muted-foreground mt-1">{tool.pricingRange}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-3">
        {tool.description}
      </p>

      {tool.aiInsights?.whyThisToolFits && (
        <div className="bg-primary/5 rounded-lg p-3 mb-6 border border-primary/10">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-primary/90 italic line-clamp-2">"{tool.aiInsights.whyThisToolFits}"</p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-2">
          {tool.useCases?.slice(0, 2).map((useCase) => (
            <span key={useCase} className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
              {useCase}
            </span>
          ))}
          {tool.useCases && tool.useCases.length > 2 && (
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
              +{tool.useCases.length - 2}
            </span>
          )}
        </div>
        
        <Link 
          href={`/tools/${tool.slug}`}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all ml-4 flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
