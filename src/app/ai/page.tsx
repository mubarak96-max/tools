import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const AI_TOOLS = [
  {
    name: "AI Humanizer",
    href: "/ai/ai-humanizer",
    description: "Rewrite AI-like text into a more natural draft with tone, complexity, and keyword controls.",
    icon: "AI",
  },
];

export const metadata = buildMetadata({
  title: "AI Tools for Rewriting and Text Polishing",
  description: "Free AI-assisted tools for rewriting, polishing, and improving text.",
  path: "/ai",
});

export default function AiPage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">AI Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          AI - {AI_TOOLS.length} tool
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          AI tools for text rewriting.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Rewrite and polish text with focused AI-assisted utilities.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {AI_TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">{tool.name}</h2>
              <span className="shrink-0 rounded-lg border border-border bg-muted p-2 text-[10px] font-black text-primary">
                {tool.icon}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
