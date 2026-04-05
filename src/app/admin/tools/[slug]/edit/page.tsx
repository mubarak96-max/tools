import ToolForm from "@/components/admin/ToolForm";
import { listCategories } from "@/lib/db/taxonomies";
import { getToolBySlug, listTools } from "@/lib/db/tools";
import { notFound } from "next/navigation";
import type { Tool, ToolCategory } from "@/types/database";

async function getCategories(): Promise<ToolCategory[]> {
  return listCategories();
}

async function getTool(slug: string): Promise<Tool | null> {
  return getToolBySlug(slug, { includeDrafts: true });
}

async function getExistingTools(): Promise<Array<Pick<Tool, "slug" | "name">>> {
  return (await listTools()).map((tool) => ({ slug: tool.slug, name: tool.name }));
}

export default async function EditToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [tool, categories, existingTools] = await Promise.all([
    getTool(slug),
    getCategories(),
    getExistingTools(),
  ]);

  if (!tool) {
    notFound(); // Redirects to 404 if tool is not found
  }

  const approvedCategories = categories
    .filter((category) => category.status === "published")
    .map((category) => category.name);

  return (
    <div className="animate-fade-in">
      <ToolForm
        initialData={tool}
        categories={categories}
        existingTools={existingTools}
        approvedCategories={approvedCategories.length > 0 ? approvedCategories : categories.map((category) => category.name)}
        isEdit={true}
      />
    </div>
  );
}
