import ToolForm from "@/components/admin/ToolForm";
import { listCategories } from "@/lib/db/taxonomies";
import { listTools } from "@/lib/db/tools";
import Link from 'next/link';
import type { Tool, ToolCategory } from "@/types/database";

async function getCategories(): Promise<ToolCategory[]> {
  return listCategories();
}

async function getExistingTools(): Promise<Array<Pick<Tool, "slug" | "name">>> {
  return (await listTools()).map((tool) => ({ slug: tool.slug, name: tool.name }));
}

export default async function NewToolPage() {
  const [categories, existingTools] = await Promise.all([getCategories(), getExistingTools()]);
  const approvedCategories = categories
    .filter((category) => category.status === "published")
    .map((category) => category.name);
  
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Tools
        </Link>
        <h1 className="text-2xl font-bold mt-4">Add New Tool</h1>
        <p className="text-muted-foreground mt-1">Create a new tool to list in the directory.</p>
      </div>

      <ToolForm
        categories={categories}
        existingTools={existingTools}
        approvedCategories={approvedCategories.length > 0 ? approvedCategories : categories.map((category) => category.name)}
        isEdit={false}
      />
    </div>
  );
}
