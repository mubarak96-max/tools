import Link from "next/link";
import { type ReactNode } from "react";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

interface HealthToolPageProps {
  title: string;
  description: string;
  category: string;
  path: string;
  children: ReactNode;
  infoSection: ReactNode;
}

export function HealthToolPage({ 
  title, 
  description, 
  category, 
  path, 
  children,
  infoSection 
}: HealthToolPageProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/health" className="hover:text-primary">{category}</Link></li>
            <li>/</li>
            <li className="text-foreground">{title}</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Health Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      {children}

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none prose-invert">
          {infoSection}
        </div>
      </section>

      <RelatedToolsSection category="Health" categoryHref="/health" currentPath={path} />
    </div>
  );
}
