import Link from "next/link";
import { ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";

import {
  approvePageForPublish,
  approveToolForPublish,
  regeneratePageEditorial,
  regenerateToolEditorial,
  returnPageToDraft,
  returnToolToDraft,
} from "@/app/admin/actions";
import { listPages } from "@/lib/db/pages";
import { listCategories } from "@/lib/db/taxonomies";
import { listTools } from "@/lib/db/tools";
import { scorePageDraft, scoreToolDraft } from "@/lib/generation/score";
import { getConfidenceTone, getWorkflowStatusTone } from "@/lib/ui";
import { cn } from "@/lib/utils";

type ReviewRow = {
  type: "Tool" | "Page";
  title: string;
  slug: string;
  status: string;
  confidence: string;
  confidenceValue?: number;
  warnings: string[];
  href: string;
};

export const dynamic = "force-dynamic";

function buildToolWarnings(
  allTools: Awaited<ReturnType<typeof listTools>>,
  approvedCategories: string[],
): (tool: Awaited<ReturnType<typeof listTools>>[number]) => string[] {
  return (tool) => {
    return scoreToolDraft(
      tool,
      allTools.map((entry) => ({ slug: entry.slug, name: entry.name })),
      { approvedCategories },
    ).warnings;
  };
}

function buildPageWarnings(): (page: Awaited<ReturnType<typeof listPages>>[number]) => string[] {
  return (page) => {
    return scorePageDraft(page).warnings;
  };
}

export default async function ReviewQueuePage() {
  const [tools, pages, categories] = await Promise.all([listTools(), listPages(), listCategories()]);
  const approvedCategories = categories
    .filter((category) => category.status === "published")
    .map((category) => category.name);
  const toolWarnings = buildToolWarnings(tools, approvedCategories);
  const pageWarnings = buildPageWarnings();

  const reviewRows: ReviewRow[] = [
    ...tools
      .filter((tool) => tool.status !== "published" || (tool.sourceConfidence ?? 1) < 0.6)
      .map((tool) => ({
        type: "Tool" as const,
        title: tool.name,
        slug: tool.slug,
        status: tool.status,
        confidence: `${Math.round((tool.sourceConfidence ?? 1) * 100)}%`,
        confidenceValue: Math.round((tool.sourceConfidence ?? 1) * 100),
        warnings: toolWarnings(tool),
        href: `/admin/tools/${tool.slug}/edit`,
      })),
    ...pages
      .filter((page) => page.status !== "published")
      .map((page) => ({
        type: "Page" as const,
        title: page.title,
        slug: page.slug,
        status: page.status,
        confidence: page.qualityScore !== undefined ? `${page.qualityScore}%` : "N/A",
        confidenceValue: page.qualityScore,
        warnings: pageWarnings(page),
        href: `/admin/pages/${page.slug}/edit`,
      })),
  ].sort(
    (left, right) =>
      right.warnings.length - left.warnings.length ||
      left.status.localeCompare(right.status) ||
      left.title.localeCompare(right.title),
  );

  function getRowActions(row: ReviewRow) {
    if (row.type === "Tool") {
      return {
        approve: approveToolForPublish.bind(null, row.slug),
        reject: returnToolToDraft.bind(null, row.slug),
        regenerate: regenerateToolEditorial.bind(null, row.slug),
      };
    }

    return {
      approve: approvePageForPublish.bind(null, row.slug),
      reject: returnPageToDraft.bind(null, row.slug),
      regenerate: regeneratePageEditorial.bind(null, row.slug),
    };
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="space-y-4">
          <div className="primary-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            Review Queue
          </div>
          <h1 className="section-heading text-4xl text-foreground md:text-5xl">
            Work through drafts and low-confidence records before publish.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            This queue surfaces items that still need human review, missing fields, or stronger confidence before they should become search-entry pages.
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Items needing attention</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Warnings are heuristic for now and will tighten further during the generation-pipeline rewrite.
            </p>
          </div>
          <span className="slate-chip rounded-full px-4 py-2 text-sm font-medium">
            {reviewRows.length} items
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-border/70">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Title</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Confidence</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Warnings</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewRows.map((row) => {
                const actions = getRowActions(row);

                return (
                <tr key={`${row.type}-${row.slug}`} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-4 text-sm text-muted-foreground">{row.type}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">{row.title}</div>
                    <div className="text-xs text-muted-foreground">{row.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize", getWorkflowStatusTone(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", getConfidenceTone(row.confidenceValue))}>
                      {row.confidence}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {row.warnings.length > 0 ? (
                        row.warnings.map((warning) => (
                          <span
                            key={warning}
                            className="warning-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                          >
                            <AlertTriangle className="h-3 w-3 text-warning" />
                            {warning}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No warnings</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <form action={actions.approve}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full bg-success px-3 py-2 text-xs font-semibold text-success-foreground shadow-lg shadow-success/15"
                        >
                          Publish
                        </button>
                      </form>
                      <form action={actions.regenerate}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-2 text-xs font-semibold text-primary-soft-foreground"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Regenerate
                        </button>
                      </form>
                      <form action={actions.reject}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          Return to draft
                        </button>
                      </form>
                      <Link href={row.href} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-primary">
                        Edit
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
