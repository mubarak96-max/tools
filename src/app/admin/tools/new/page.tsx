import ToolForm from "@/components/admin/ToolForm";
import { listCategories } from "@/lib/db/taxonomies";
import { listTools } from "@/lib/db/tools";
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
    <div className="animate-fade-in">
      <ToolForm
        categories={categories}
        existingTools={existingTools}
        approvedCategories={approvedCategories.length > 0 ? approvedCategories : categories.map((category) => category.name)}
        isEdit={false}
      />
    </div>
  );
}
