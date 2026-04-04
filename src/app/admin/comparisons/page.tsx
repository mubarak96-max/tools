import Link from "next/link";
import { ArrowRightLeft, ExternalLink } from "lucide-react";

import { listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { comparisonSlug } from "@/lib/slug";
import { getComparisonScoreTone } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/database";

type ComparisonOpportunity = {
  slug: string;
  left: Tool;
  right: Tool;
  score: number;
};

export const dynamic = "force-dynamic";

function getComparisonOpportunities(tools: Tool[]): ComparisonOpportunity[] {
  return tools
    .flatMap((tool, index) =>
      tools.slice(index + 1).map((candidate) => ({
        left: tool,
        right: candidate,
        score: scoreComparisonPair(tool, candidate),
      })),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.left.name.localeCompare(right.left.name))
    .slice(0, 20)
    .map((entry) => ({
      ...entry,
      slug: comparisonSlug(entry.left.slug, entry.right.slug),
    }));
}

export default async function AdminComparisonsPage() {
  const tools = await listTools({ status: ["published"] });
  const opportunities = getComparisonOpportunities(tools);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
        <div className="space-y-4">
          <div className="primary-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            Comparisons
          </div>
          <h1 className="section-heading text-4xl text-foreground md:text-5xl">
            Overlap-driven comparison opportunities.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            This view surfaces the strongest head-to-head pairs from the published tool dataset so comparison coverage is driven by structured overlap, not guesswork.
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Suggested comparison pairs</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Higher scores indicate stronger overlap in category, use case, audience, pricing, and workflow fit.
            </p>
          </div>
          <span className="slate-chip rounded-full px-4 py-2 text-sm font-medium">
            {opportunities.length} pairs
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-border/70">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Pair</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Overlap Score</th>
                <th className="px-4 py-3 text-sm font-semibold text-foreground">Use Cases</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((item) => (
                <tr key={item.slug} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {item.left.name} vs {item.right.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.slug}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{item.left.category}</td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", getComparisonScoreTone(item.score))}>
                      {item.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {[...new Set([...item.left.useCases, ...item.right.useCases])].slice(0, 3).join(", ")}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/compare/${item.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-primary"
                      >
                        Preview
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <Link
                        href={`/admin/tools/${item.left.slug}/edit`}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                        Review tools
                      </Link>
                    </div>
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
