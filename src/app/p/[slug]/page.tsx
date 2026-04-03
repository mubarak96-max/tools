import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, LayoutTemplate, Scale } from "lucide-react";
import { notFound } from "next/navigation";

import SectionHeader from "@/components/sections/SectionHeader";
import ToolCard from "@/components/ToolCard";
import { getPageBySlug } from "@/lib/db/pages";
import { getToolsBySlugs } from "@/lib/db/tools";
import { buildMetadata } from "@/lib/seo/metadata";
import type { CustomPage, Tool } from "@/types/database";

export const revalidate = 3600;

async function getPage(slug: string): Promise<CustomPage | null> {
  return getPageBySlug(slug);
}

async function getToolsForPage(toolSlugs: string[]): Promise<Tool[]> {
  return getToolsBySlugs(toolSlugs);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "Not Found" };

  return buildMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/p/${page.slug}`,
  });
}

function renderComparisonTemplate(page: CustomPage, tools: Tool[]) {
  const [tool1, tool2] = tools;

  if (!tool1 || !tool2) {
    return (
      <div className="glass-card rounded-[1.75rem] p-10 text-center text-muted-foreground">
        Select at least two tools to render this comparison page.
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {[tool1, tool2].map((tool) => (
        <div key={tool.slug} className="glass-card rounded-[1.75rem] p-6">
          <h2 className="text-3xl font-semibold text-foreground">{tool.name}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{tool.shortDescription}</p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-[1.25rem] border border-border/70 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Pricing:</strong> {tool.pricingRange}
            </div>
            <div className="rounded-[1.25rem] border border-border/70 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Best for:</strong> {tool.bestFor || tool.aiInsights?.bestFor || "General software evaluation"}
            </div>
          </div>
          <Link
            href={`/tools/${tool.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
          >
            Review {tool.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </section>
  );
}

export default async function CustomDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  const tools = await getToolsForPage(page.toolSlugs || []);

  return (
    <div className="flex flex-col gap-14 pb-24">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                Custom Editorial Page
              </span>
              <span className="muted-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                {page.templateType}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                {page.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {page.metaDescription}
              </p>
            </div>
          </div>

          <div className="glass-card rounded-[1.75rem] p-6">
            <div className="flex items-center gap-2">
              {page.templateType === "comparison" ? (
                <Scale className="h-5 w-5 text-primary" />
              ) : (
                <LayoutTemplate className="h-5 w-5 text-primary" />
              )}
              <p className="text-sm font-semibold text-foreground">
                {tools.length} linked tools
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              This page is now rendered through the shared public page system instead of a one-off template blob.
            </p>
          </div>
        </div>
      </section>

      {page.editorialVerdict ? (
        <section className="glass-card rounded-[1.75rem] p-6">
          <SectionHeader
            eyebrow="Editorial Verdict"
            title="Structured context"
            description="Editorial copy now sits above the selected tool set, rather than replacing it."
          />
          <div
            className="prose mt-8 max-w-none prose-p:text-muted-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: page.editorialVerdict }}
          />
        </section>
      ) : null}

      {page.templateType === "comparison" ? (
        renderComparisonTemplate(page, tools)
      ) : (
        <section className="space-y-8">
          <SectionHeader
            eyebrow="Selected Tools"
            title="The tools attached to this page."
            description="Manual and generated editorial pages now share the same card system as the core directory."
          />
          {tools.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-[1.75rem] p-10 text-center text-muted-foreground">
              No tools are attached to this page yet.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
