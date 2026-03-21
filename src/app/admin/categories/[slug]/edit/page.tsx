import { adminDb } from "@/lib/firebase-admin";
import { ToolCategory } from "@/types/database";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import Link from "next/link";
import { serializeData } from "@/lib/utils";

async function getCategory(slug: string): Promise<ToolCategory | null> {
  if (!adminDb) return null;
  const doc = await adminDb.collection('categories').doc(slug).get();
  return doc.exists ? ({ id: doc.id, ...serializeData(doc.data()) } as ToolCategory) : null;
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
