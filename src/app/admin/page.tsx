import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Clock3,
  FileText,
  Search,
  Wrench,
} from "lucide-react";

import { listPages } from "@/lib/db/pages";
import { listTools } from "@/lib/db/tools";
import { cn } from "@/lib/utils";

type RecentItem = {
  type: "Tool" | "Page";
  title: string;
  slug: string;
  href: string;
  updatedAt: string;
  status: string;
  confidence?: number;
};

function formatRelativeTime(value?: string) {
  if (!value) return "Recently";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Recently";

  const diffHours = Math.max(1, Math.round((Date.now() - timestamp) / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function confidenceTone(value: number) {
  if (value >= 80) return "bg-success";
  if (value >= 65) return "bg-warning";
  return "bg-danger";
}

function statusDotTone(status: string) {
  switch (status) {
    case "published":
      return "bg-success";
    case "review":
      return "bg-warning";
    default:
      return "bg-muted-foreground";
  }
}

function typeTone(type: RecentItem["type"]) {
  return type === "Tool"
    ? "bg-primary-soft text-primary-soft-foreground"
    : "bg-warning-soft text-warning-soft-foreground";
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone: "success" | "warning" | "primary" | "danger";
}) {
  const dotTone = {
    success: "bg-success",
    warning: "bg-warning",
    primary: "bg-primary",
    danger: "bg-danger",
  }[tone];

  return (
    <div className="rounded-[1.25rem] border border-border bg-muted px-4 py-4">
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotTone)} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-semibold leading-none text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function ActionRow({
  href,
  icon,
  title,
  subtitle,
  tone,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  tone: "primary" | "warning" | "success";
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
  }[tone];

  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-[0.8rem]", toneClass)}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
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
  const lowConfidenceTools = tools.filter((tool) => (tool.sourceConfidence ?? 1) < 0.6);

  const recentItems: RecentItem[] = [
    ...tools.map((tool) => ({
      type: "Tool" as const,
      title: tool.name,
      slug: tool.slug,
      href: `/admin/tools/${tool.slug}/edit`,
      updatedAt: tool.updatedAt ?? "",
      status: tool.status,
      confidence: Math.round((tool.sourceConfidence ?? 0.8) * 100),
    })),
    ...pages.map((page) => ({
      type: "Page" as const,
      title: page.title,
      slug: page.slug,
      href: `/admin/pages/${page.slug}/edit`,
      updatedAt: page.updatedAt ?? "",
      status: page.status,
      confidence: undefined,
    })),
  ]
    .sort((left, right) => {
      const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightTime - leftTime;
    })
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="md:hidden">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Overview
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published tools" value={publishedTools} hint="+2 this week" tone="success" />
        <StatCard label="Draft tools" value={draftTools} hint="Nothing pending" tone="warning" />
        <StatCard label="Review queue" value={reviewItems.length} hint="All clear" tone="primary" />
        <StatCard label="Low confidence" value={lowConfidenceTools.length} hint="No flags" tone="danger" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Next editorial actions</h2>
            <Link href="/admin/review" className="text-xs text-primary">
              View all →
            </Link>
          </div>
          <div className="py-1">
            <ActionRow
              href="/admin/review"
              icon={<Clock3 className="h-4 w-4" />}
              title="Open review queue"
              subtitle={`${reviewItems.length} items pending review`}
              tone="primary"
            />
            <ActionRow
              href="/admin/tools"
              icon={<Wrench className="h-4 w-4" />}
              title="Audit tool records"
              subtitle="Check pricing and descriptions"
              tone="warning"
            />
            <ActionRow
              href="/admin/pages"
              icon={<FileText className="h-4 w-4" />}
              title="Audit page records"
              subtitle="Review page accuracy"
              tone="success"
            />
          </div>
        </div>

        <div className="hidden rounded-[1.5rem] border border-border bg-card lg:block">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Publishing priorities</h2>
          </div>
          <div className="space-y-4 px-4 py-4">
            {[
              {
                tone: "bg-success",
                text: "Move items through edit, validation, and publish rather than treating AI output as final.",
              },
              {
                tone: "bg-warning",
                text: "Use tools and pages screens to correct missing pricing, weak descriptions, or sparse use-case coverage.",
              },
              {
                tone: "bg-danger",
                text: "Keep an eye on low-confidence items before they become public search-entry pages.",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", item.tone)} />
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
        <div className="border-b border-border px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Records</h2>
            <Link href="/admin/tools" className="text-xs text-primary">
              See all →
            </Link>
          </div>
        </div>

        <div className="hidden flex-col gap-3 border-b border-border px-4 py-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recently updated records</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              <button className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                All
              </button>
              <button className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Tools
              </button>
              <button className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Pages
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-[0.8rem] border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              Filter records...
            </div>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/80">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => (
                <tr key={`${item.type}-${item.slug}`} className="border-b border-border last:border-b-0 hover:bg-muted/60">
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", typeTone(item.type))}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{item.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{item.slug}</td>
                  <td className="px-4 py-3">
                    {typeof item.confidence === "number" ? (
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 overflow-hidden rounded-full bg-border">
                          <div
                            className={cn("h-full rounded-full", confidenceTone(item.confidence))}
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.confidence}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">n/a</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusDotTone(item.status))} />
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(item.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={item.href} className="text-xs font-medium text-primary">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border lg:hidden">
          {recentItems.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-medium", typeTone(item.type))}>
                    {item.type}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">{item.slug}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {typeof item.confidence === "number" ? (
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-10 overflow-hidden rounded-full bg-border">
                      <div
                        className={cn("h-full rounded-full", confidenceTone(item.confidence))}
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.confidence}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-1.5">
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusDotTone(item.status))} />
                  <span className="text-[11px] text-muted-foreground capitalize">{item.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-2 md:hidden" />
      <div className="h-16 md:hidden" />
    </div>
  );
}
