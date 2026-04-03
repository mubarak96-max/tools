import ToolCard from "@/components/ToolCard";
import { listTools } from "@/lib/db/tools";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from 'next';
import type { Tool } from "@/types/database";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "All AI Tools & Software Directory (2026)",
  description: "Browse our complete directory of top-rated AI tools and software platforms, thoroughly analyzed by AI.",
  path: "/tools",
});

function matchesQuery(tool: Tool, query: string) {
  const haystack = [
    tool.name,
    tool.category,
    tool.shortDescription,
    tool.pricing,
    tool.pricingRange,
    ...tool.useCases,
    ...tool.features,
    ...tool.platforms,
    ...tool.integrations,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

async function getAllTools(query?: string): Promise<Tool[]> {
  const tools = await listTools({ status: ["published"] });

  if (!query) {
    return tools;
  }

  return tools.filter((tool) => matchesQuery(tool, query));
}

export default async function AllToolsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const queryValue = searchParams.q;
  const query = Array.isArray(queryValue) ? queryValue[0] : queryValue;
  const tools = await getAllTools(query);

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-10 sm:px-8 md:px-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(24,70,133,0.12),transparent_55%)] lg:block" />
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Software Directory
          </div>
          <h1 className="section-heading text-4xl text-foreground md:text-6xl">
            Explore tools by fit, not just by name.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Search the live directory across tool names, pricing, platforms, features, and use cases.
          </p>

          <form action="/tools" className="glass flex flex-col gap-4 rounded-[1.75rem] p-4 md:flex-row md:items-center">
            <input
              type="search"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search by tool, pricing, use case, or platform"
              className="surface-outline w-full flex-1 rounded-[1.25rem] bg-background/70 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="rounded-[1.25rem] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{tools.length} results</span>
            {query ? (
              <span>
                for <strong className="text-foreground">{query}</strong>
              </span>
            ) : (
              <span>across all published tools</span>
            )}
          </div>
        </div>
      </section>

      <section>
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[1.75rem] p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No matching tools found.</h3>
            <p className="text-muted-foreground">
              Try a broader term like free, AI, project management, or desktop.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
