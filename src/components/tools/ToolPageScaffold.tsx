import Link from "next/link";
import type { ReactNode } from "react";

import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import { getRelatedFreeTools } from "@/lib/tools/registry";
import { FREE_TOOLS } from "@/lib/tools/registry";

// Privacy trust note shown on every tool page
export function PrivacyNote() {
  return null;
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
    <section className="space-y-5 border-t border-border/60 pt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          More {category.toLowerCase()} tools
        </h2>
        <Link href={categoryHref} className="text-sm font-medium text-primary hover:underline">
          All {category.toLowerCase()} tools →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool, index) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group flex flex-col gap-2 py-4 transition-colors hover:text-primary ${index === 0 ? "" : "border-t border-border/50"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {tool.name}
              </h3>
              <div className="shrink-0 rounded-md border border-border bg-muted p-1.5">
                <FreeToolIcon tool={tool} size={16} />
              </div>
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
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-3 sm:space-y-5">
        <nav aria-label="Breadcrumb" className="hidden sm:block sm:mb-4">
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
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:mt-4 sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">{description}</p>
          {currentTool && currentTool.description !== description ? (
            <p className="mt-2 hidden text-sm leading-6 text-muted-foreground sm:block">{currentTool.description}</p>
          ) : null}
        </div>

        {showPrivacyNote && (
          <div className="mt-3 max-w-2xl sm:mt-5">
            <PrivacyNote />
          </div>
        )}
      </section>

      {children}

      {learn ? (
        <section className="space-y-4 border-t border-border/60 pt-8">
          {learn}
        </section>
      ) : null}

      {faqs?.length ? (
        <section className="space-y-6 border-t border-border/60 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((item, index) => (
              <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
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
