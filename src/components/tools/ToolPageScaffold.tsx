import Link from "next/link";
import type { ReactNode } from "react";

import { getRelatedFreeTools } from "@/lib/tools/registry";
import { FREE_TOOLS } from "@/lib/tools/registry";

// Privacy trust note shown on every tool page
export function PrivacyNote() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-success/25 bg-success-soft px-4 py-3">
      <span className="mt-0.5 text-base leading-none">🔒</span>
      <p className="text-sm leading-6 text-success-soft-foreground">
        <strong className="font-semibold">Private by design.</strong>{" "}
        All processing runs in your browser — files and text never leave your device, and nothing is stored on our servers.
      </p>
    </div>
  );
}

// Shared related-tools grid used at the bottom of every tool page
export function RelatedToolsSection({
  category,
  categoryHref,
  currentPath,
}: {
  category: string;
  categoryHref: string;
  currentPath: string;
}) {
  const related = getRelatedFreeTools(currentPath, 6);

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          More {category.toLowerCase()} tools
        </h2>
        <Link href={categoryHref} className="text-sm font-medium text-primary hover:underline">
          All {category.toLowerCase()} tools →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-2 rounded-[1.25rem] border border-border bg-background p-4 transition-all hover:border-primary/20 hover:bg-primary-soft"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {tool.name}
              </h3>
              {tool.icon && (
                <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {tool.icon}
                </span>
              )}
            </div>
            <p className="text-xs leading-5 text-muted-foreground line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ToolPageScaffold({
  path,
  category,
  categoryHref,
  title,
  description,
  children,
  learn,
  faqs,
  showPrivacyNote = true,
}: {
  path: string;
  category: string;
  categoryHref: string;
  title: string;
  description: string;
  children: ReactNode;
  learn?: ReactNode;
  faqs?: Array<{ question: string; answer: string }>;
  showPrivacyNote?: boolean;
}) {
  const currentTool = FREE_TOOLS.find((tool) => tool.href === path);

  return (
    <div className="space-y-8">
      {/* Header card */}
      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href={categoryHref} className="hover:text-primary">{category}</Link></li>
            <li>/</li>
            <li className="text-foreground">{title}</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {category} utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          {currentTool && currentTool.description !== description ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>

        {/* Privacy note inline in header */}
        {showPrivacyNote && (
          <div className="mt-6 max-w-2xl">
            <PrivacyNote />
          </div>
        )}
      </section>

      {children}

      {learn ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          {learn}
        </section>
      ) : null}

      {faqs?.length ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <RelatedToolsSection
        category={category}
        categoryHref={categoryHref}
        currentPath={path}
      />
    </div>
  );
}
