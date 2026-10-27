import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { slugify } from "@/lib/slug";
import { ALL_TOOLS, type Tool } from "@/lib/tools-data";
import type { HubContent } from "@/lib/hubs/types";

const HUBS: Array<{ label: string; href: string }> = [
  { label: "Finance", href: "/finance" },
  { label: "Real Estate", href: "/real-estate" },
  { label: "Text", href: "/text" },
  { label: "SEO", href: "/seo" },
  { label: "Marketing", href: "/marketing" },
  { label: "Design", href: "/design" },
  { label: "Image", href: "/image" },
  { label: "Utility", href: "/utility" },
  { label: "Health", href: "/health" },
  { label: "Construction", href: "/construction" },
  { label: "AI", href: "/ai" },
];

const TOOLS_BY_HREF = new Map(ALL_TOOLS.map((tool) => [tool.href, tool]));

// Fail the build on a typo'd href instead of silently dropping a tool from its hub.
function resolveTool(href: string, hubPath: string): Tool {
  const tool = TOOLS_BY_HREF.get(href);
  if (!tool) {
    throw new Error(`Hub ${hubPath} references unknown tool ${href}`);
  }
  return tool;
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {tool.name}
      </h3>
      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary">Open tool →</span>
    </Link>
  );
}

export default function CategoryHub({ content }: { content: HubContent }) {
  const groups = content.groups.map((group) => ({
    ...group,
    tools: group.hrefs.map((href) => resolveTool(href, content.path)),
  }));
  const allTools = [...new Map(groups.flatMap((g) => g.tools).map((t) => [t.href, t])).values()];

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: content.label, path: content.path },
  ]);
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.h1,
    description: content.metaDescription,
    url: absoluteUrl(content.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allTools.length,
      itemListElement: allTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: absoluteUrl(tool.href),
      })),
    },
  };
  const faq = buildFaqJsonLd(content.faqs);

  return (
    <div className="space-y-10 pb-4">
      <JsonLd data={serializeJsonLd(faq ? [breadcrumb, collection, faq] : [breadcrumb, collection])} />

      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">{content.label}</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          {content.label} · {allTools.length} {allTools.length === 1 ? "tool" : "tools"}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {content.h1}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{content.lead}</p>
        {content.notice ? (
          <p className="mt-4 max-w-3xl rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            {content.notice}
          </p>
        ) : null}
      </section>

      <section className="max-w-3xl space-y-4 text-[15px] leading-7 text-muted-foreground">
        {content.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </section>

      {groups.map((group) => (
        <section key={group.heading} aria-labelledby={`group-${slugify(group.heading)}`}>
          <h2 id={`group-${slugify(group.heading)}`} className="text-xl font-semibold text-foreground">
            {group.heading}
          </h2>
          <p className="mt-2 mb-5 max-w-3xl text-sm leading-6 text-muted-foreground">{group.intro}</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.tools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">{content.methodology.heading}</h2>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          {content.methodology.points.map((point) => (
            <div key={point.title}>
              <dt className="font-semibold text-foreground">{point.title}</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">{point.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {content.guides?.length ? (
        <section>
          <h2 className="text-xl font-semibold text-foreground">Guides</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {content.guides.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href} className="text-sm font-medium text-primary hover:underline">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-xl font-semibold text-foreground">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-border rounded-[1.75rem] border border-border/80 bg-card">
          {content.faqs.map((item) => (
            <details key={item.question} className="group px-6 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {HUBS.filter((hub) => hub.href !== content.path).map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              {hub.label} tools
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
