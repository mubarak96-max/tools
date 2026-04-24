import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "SEO Tools for Search Optimization and SERP Previews",
  description:
    "Free SEO tools for YouTube title analysis, meta description pixel width checking, and SERP simulation.",
  path: "/seo",
});

type SEOToolMeta = {
  name: string;
  href: string;
  description: string;
  icon: string;
};

const SEO_TOOLS: SEOToolMeta[] = [
  {
    name: "Keyword Clustering Tool",
    href: "/seo/keyword-clustering",
    description: "Group thousands of keywords into topic clusters using semantic NLP and search intent logic.",
    icon: "CLUST",
  },
  {
    name: "YouTube Title Length Checker",
    href: "/seo/youtube-title-checker",
    description: "Analyze video titles for pixel width truncation, character limits, and SEO score with multi-device thumbnail previews.",
    icon: "YT",
  },
  {
    name: "Meta Description Checker",
    href: "/seo/meta-description-checker",
    description: "Measure title and meta description pixel width against Google limits. Real-time desktop and mobile SERP preview.",
    icon: "META",
  },
  {
    name: "Hreflang Tag Generator",
    href: "/seo/hreflang-generator",
    description: "Generate validated hreflang tags for multilingual sites. Auto-checks ISO codes, self-referencing, and reciprocity.",
    icon: "GLOB",
  },
];

function ToolCard({ tool }: { tool: SEOToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {tool.name}
        </h2>
        <div className="shrink-0 rounded-lg border border-border bg-muted p-2">
          <span className="text-[10px] font-black text-primary">{tool.icon}</span>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </span>
    </Link>
  );
}

export default function SEOPage() {
  return (
    <div className="space-y-10 pb-4">
      {/* Header */}
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">SEO Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          SEO · {SEO_TOOLS.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          SEO tools for search visibility and previews.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Professional utilities for optimizing YouTube metadata and Google SERP snippets — all browser-based with real-time pixel measurement.
        </p>
      </section>

      {/* Tool grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All SEO Tools
            <span className="ml-2 text-sm font-normal text-muted-foreground">({SEO_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SEO_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Text Tools", href: "/text" },
            { label: "Image Tools", href: "/image" },
            { label: "Health Tools", href: "/health" },
            { label: "Real Estate Tools", href: "/real-estate" },
            { label: "Utility Tools", href: "/utility" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
