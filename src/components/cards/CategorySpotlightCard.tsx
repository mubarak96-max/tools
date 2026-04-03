import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategorySpotlightCardProps {
  label: string;
  description: string;
  count: number;
  href: string;
}

export default function CategorySpotlightCard({
  label,
  description,
  count,
  href,
}: CategorySpotlightCardProps) {
  return (
    <Link
      href={href}
      className="glass-card group flex h-full flex-col justify-between rounded-[1.75rem] p-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="muted-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {count} tools
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{label}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground">
        <span>Browse recommendations</span>
        <span className="font-medium text-primary">Open</span>
      </div>
    </Link>
  );
}
