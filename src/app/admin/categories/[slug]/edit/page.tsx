import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryBySlug } from "@/lib/db/taxonomies";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ToolCategory } from "@/types/database";

async function getCategory(slug: string): Promise<ToolCategory | null> {
  return getCategoryBySlug(slug);
}

export default async function EditCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href="/admin/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Categories
        </Link>
        <h1 className="text-2xl font-bold mt-4">Edit Configuration: {category.name}</h1>
      </div>

      <CategoryForm initialData={category} isEdit={true} />
    </div>
  );
}
