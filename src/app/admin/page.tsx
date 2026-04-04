import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

import { listPages } from "@/lib/db/pages";
import { listTools } from "@/lib/db/tools";
import { getWorkflowStatusTone } from "@/lib/ui";
import { cn } from "@/lib/utils";

function metricCard(label: string, value: string, note: string, tone: string) {
  return (
    <div className="glass-card rounded-[1.6rem] border border-border/80 p-6">
      <p className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", tone)}>
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold text-foreground">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{note}</p>
    </div>
  );
}

export default async function AdminIndex() {
  const [tools, pages] = await Promise.all([listTools(), listPages()]);

  const publishedTools = tools.filter((tool) => tool.status === "published").length;
  const draftTools = tools.filter((tool) => tool.status === "draft").length;
  const reviewItems = [
    ...tools.filter((tool) => tool.status === "review"),
    ...pages.filter((page) => page.status === "review"),
  ];
  const lowConfidenceTools = tools.filter(
    (tool) => (tool.sourceConfidence ?? 1) < 0.6,
  );

  const recentItems = [
    ...tools.map((tool) => ({
      type: "Tool",
      title: tool.name,
      slug: tool.slug,
      href: `/admin/tools/${tool.slug}/edit`,
      updatedAt: tool.updatedAt ?? "",
      status: tool.status,
    })),
    ...pages.map((page) => ({
      type: "Page",
      title: page.title,
      slug: page.slug,
      href: `/admin/pages/${page.slug}/edit`,
      updatedAt: page.updatedAt ?? "",
      status: page.status,
    })),
  ]
    .sort((left, right) => {
      const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightTime - leftTime;
    })
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-6">
            <div className="primary-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Admin Overview
            </div>
            <div className="space-y-4">
              <h1 className="section-heading text-4xl text-foreground md:text-6xl">
                Review, refine, and publish with more control.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                This dashboard is the first step away from one-click AI publishing and toward a controlled editorial workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {metricCard("Published Tools", String(publishedTools), "Public records currently visible in the live directory.", "border-success/20 bg-success-soft text-success-soft-foreground")}
            {metricCard("Draft Tools", String(draftTools), "Records that still need editorial cleanup or factual completion.", "border-border/90 bg-muted text-muted-foreground")}
            {metricCard("Review Queue", String(reviewItems.length), "Items that should be checked before publish status is approved.", "border-warning/20 bg-warning-soft text-warning-soft-foreground")}
            {metricCard("Low Confidence", String(lowConfidenceTools.length), "Tool records flagged by the current confidence heuristic.", "border-destructive/20 bg-danger-soft text-danger-soft-foreground")}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass-card rounded-[1.75rem] border border-success/15 p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <h2 className="text-2xl font-semibold text-foreground">Publishing priorities</h2>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
            <div className="rounded-[1.25rem] border border-border/70 p-4">
              Move items in review through edit, validation, and publish rather than treating AI output as final.
            </div>
            <div className="rounded-[1.25rem] border border-border/70 p-4">
              Use the tools and pages screens to correct missing pricing, weak descriptions, or sparse use-case coverage.
            </div>
            <div className="rounded-[1.25rem] border border-border/70 p-4">
              Keep an eye on low-confidence items before they become public search-entry pages.
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[1.75rem] border border-primary/15 p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-2xl font-semibold text-foreground">Next editorial actions</h2>
          </div>
          <div className="mt-6 grid gap-3">
            <Link
              href="/admin/review"
              className="flex items-center justify-between rounded-[1.25rem] border border-border/70 px-4 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
            >
              Open review queue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/tools"
              className="flex items-center justify-between rounded-[1.25rem] border border-border/70 px-4 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
            >
              Audit tool records
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/pages"
              className="flex items-center justify-between rounded-[1.25rem] border border-border/70 px-4 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary"
            >
              Audit page records
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Recently updated records</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use this as a quick handoff list while the fuller workflow continues to evolve.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-border/70">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Title</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Slug</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => (
                <tr key={`${item.type}-${item.slug}`} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-4 text-sm text-muted-foreground">{item.type}</td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">{item.title}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{item.slug}</td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize", getWorkflowStatusTone(item.status))}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Edit
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
