import { deletePage } from "@/app/admin/actions";
import AutoGeneratePage from "@/components/admin/AutoGeneratePage";
import { listPages } from "@/lib/db/pages";
import { listTools } from "@/lib/db/tools";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, LayoutTemplate } from "lucide-react";
import type { CustomPage, Tool } from "@/types/database";

export const dynamic = 'force-dynamic';

async function getAdminPages(): Promise<CustomPage[]> {
  return listPages();
}

async function getAvailableTools(): Promise<Tool[]> {
  return listTools();
}

export default async function AdminPagesDataTable() {
  const [pages, tools] = await Promise.all([getAdminPages(), getAvailableTools()]);

  return (
    <div className="space-y-8">
      <AutoGeneratePage tools={tools} />
      
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card/80 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Custom SEO Pages</h1>
          <p className="mt-1 text-muted-foreground">
            Review deterministic tool selections, then add editorial blocks before publishing.
          </p>
        </div>
        <Link href="/admin/pages/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Create Page
        </Link>
      </div>

      <div className="glass-card overflow-hidden rounded-[1.75rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-border/70 bg-background/75">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Page Title & Slug</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Template</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Curated Tools</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {pages.map((page) => (
                <tr key={page.slug} className="group transition-colors hover:bg-background/60">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {page.title}
                      <Link href={`/p/${page.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">/p/{page.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex w-fit items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                      <LayoutTemplate className="w-3 h-3" /> {page.templateType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {page.toolSlugs?.length || 0} selected
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/pages/${page.slug}/edit`} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <form action={deletePage.bind(null, page.slug)}>
                        <button type="submit" className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              
              {pages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No custom pages found. Create your first programmatic SEO page!
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
