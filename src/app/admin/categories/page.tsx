import { adminDb } from "@/lib/firebase-admin";
import { ToolCategory } from "@/types/database";
import { deleteCategory } from "@/app/admin/actions";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getCategories(): Promise<ToolCategory[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('categories').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ToolCategory[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage the taxonomy and SEO metadata for your tool categories.</p>
        </div>
        <Link href="/admin/categories/new" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Category Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Slug</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{cat.description}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${cat.slug}/edit`} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <form action={deleteCategory.bind(null, cat.slug)}>
                        <button type="submit" className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No categories found. Create one to organize your tools!
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
