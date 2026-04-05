import { deleteTool } from "@/app/admin/actions";
import AutoGenerateTool from "@/components/admin/AutoGenerateTool";
import { listCategories } from "@/lib/db/taxonomies";
import { listTools } from "@/lib/db/tools";
import { getWorkflowStatusTone } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit2, Trash2, Sparkles, ExternalLink } from "lucide-react";
import type { Tool, ToolCategory } from "@/types/database";

export const dynamic = 'force-dynamic';

async function getAdminTools(): Promise<Tool[]> {
  return listTools();
}

async function getCategories(): Promise<ToolCategory[]> {
  return listCategories();
}

export default async function AdminToolsPage() {
  const [tools, categories] = await Promise.all([getAdminTools(), getCategories()]);

  return (
    <div className="space-y-8">
      <AutoGenerateTool categories={categories} />

      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card/80 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools Database</h1>
          <p className="mt-1 text-muted-foreground">
            Manage curated tools, manual entries, and AI-assisted drafts in one reviewable queue.
          </p>
        </div>
        <Link
          href="/admin/tools/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Manual Add
        </Link>
      </div>

      <div className="glass-card overflow-hidden rounded-[1.75rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-border/70 bg-background/75">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Name & Slug</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Pricing</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Editorial</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tools.map((tool) => (
                <tr key={tool.slug} className="group transition-colors hover:bg-background/60">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {tool.name}
                      <Link href={`/tools/${tool.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tool.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                      {(tool.categories?.length ? tool.categories : [tool.category]).join(", ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {tool.pricing}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium capitalize", getWorkflowStatusTone(tool.status))}>
                      {tool.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tool.aiInsights ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <Sparkles className="w-3 h-3" /> Generated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/tools/${tool.slug}/edit`} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <form action={deleteTool.bind(null, tool.slug)}>
                        <button type="submit" className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              
              {tools.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No tools found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
