import { adminDb } from "@/lib/firebase-admin";
import { CustomPage, Tool } from "@/types/database";
import { deletePage } from "@/app/admin/actions";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, LayoutTemplate } from "lucide-react";
import AutoGeneratePage from "@/components/admin/AutoGeneratePage";
import { serializeData } from "@/lib/utils";

export const dynamic = 'force-dynamic';

async function getAdminPages(): Promise<CustomPage[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('pages').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as CustomPage[];
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

async function getAvailableTools(): Promise<Tool[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('tools').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as Tool[];
  } catch (error) {
    return [];
  }
}

export default async function AdminPagesDataTable() {
  const [pages, tools] = await Promise.all([getAdminPages(), getAvailableTools()]);

  return (
    <div className="space-y-6">
      <AutoGeneratePage tools={tools} />
      
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5 mt-8">
        <div>
          <h1 className="text-2xl font-bold">Custom SEO Pages</h1>
          <p className="text-muted-foreground mt-1">Manage dynamic programmatic pages (like 'Best Tools for X').</p>
        </div>
        <Link href="/admin/pages/new" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Create Page
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Page Title & Slug</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Template</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Curated Tools</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pages.map((page) => (
                <tr key={page.slug} className="hover:bg-white/[0.02] transition-colors group">
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
                    <span className="px-2.5 py-1 bg-white/5 rounded-md text-xs text-muted-foreground border border-white/5 flex items-center gap-1.5 w-fit">
                      <LayoutTemplate className="w-3 h-3" /> {page.templateType}
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
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
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
