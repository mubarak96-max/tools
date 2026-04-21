import Link from "next/link";
import type { ReactNode } from "react";

import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export function HealthToolPage({
  title,
  description,
  category,
  path,
  children,
  infoSection,
}: {
  title: string;
  description: string;
  category: string;
  path: string;
  children: ReactNode;
  infoSection?: ReactNode;
}) {
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
          <p className="mt-4 rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            This calculator is for education and planning only. It is not medical advice,
            diagnosis, treatment, or a substitute for guidance from a qualified clinician,
            dietitian, or other health professional.
          </p>
        </div>
      </section>

      {children}

      {infoSection ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">{infoSection}</div>
        </section>
      ) : null}

      <RelatedToolsSection category="Health" categoryHref="/health" currentPath={path} />
    </div>
  );
}
