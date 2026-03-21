import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import { deleteTool } from "@/app/admin/actions";
import Link from "next/link";
import { Plus, Edit2, Trash2, Sparkles, ExternalLink } from "lucide-react";
import AutoGenerateTool from "@/components/admin/AutoGenerateTool";
import { ToolCategory } from "@/types/database";
import { serializeData } from "@/lib/utils";

export const dynamic = 'force-dynamic';

async function getAdminTools(): Promise<Tool[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('tools').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as Tool[];
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

async function getCategories(): Promise<ToolCategory[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('categories').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as ToolCategory[];
  } catch (error) {
    return [];
  }
}

export default async function AdminToolsPage() {
  const [tools, categories] = await Promise.all([getAdminTools(), getCategories()]);

  return (
    <div className="space-y-6">
      {/* Rapid AI Builder */}
      <AutoGenerateTool categories={categories} />

      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5 mt-8">
        <div>
          <h1 className="text-2xl font-bold">Tools Database</h1>
          <p className="text-muted-foreground mt-1">Manage all your platform's curated tools.</p>
        </div>
        <Link href="/admin/tools/new" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Manual Add
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Name & Slug</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Pricing</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">AI Insights</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tools.map((tool) => (
                <tr key={tool.slug} className="hover:bg-white/[0.02] transition-colors group">
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
                    <span className="px-2.5 py-1 bg-white/5 rounded-md text-xs text-muted-foreground border border-white/5">
                      {tool.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {tool.pricing}
                  </td>
                  <td className="px-6 py-4">
                    {tool.aiInsights ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium border border-green-500/20">
                        <Sparkles className="w-3 h-3" /> Generated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 rounded-md text-xs font-medium border border-red-500/20">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
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
