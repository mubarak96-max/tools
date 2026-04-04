import { Suspense } from "react";

import ToolsDirectoryClient from "@/components/ToolsDirectoryClient";
import ToolCard from "@/components/ToolCard";
import { listTools } from "@/lib/db/tools";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = buildMetadata({
  title: "All AI Tools & Software Directory (2026)",
  description: "Browse our complete directory of top-rated AI tools and software platforms, thoroughly analyzed by AI.",
  path: "/tools",
});

function ToolsDirectoryFallback({
  tools,
}: {
  tools: Awaited<ReturnType<typeof listTools>>;
}) {
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
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function AllToolsPage() {
  const tools = await listTools({ status: ["published"] });

  return (
    <Suspense fallback={<ToolsDirectoryFallback tools={tools} />}>
      <ToolsDirectoryClient tools={tools} />
    </Suspense>
  );
}
