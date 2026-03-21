import { adminDb } from "@/lib/firebase-admin";
import { Tool, ToolCategory } from "@/types/database";
import { notFound } from "next/navigation";
import ToolForm from "@/components/admin/ToolForm";
import Link from "next/link";
import { serializeData } from "@/lib/utils";

async function getCategories(): Promise<ToolCategory[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('categories').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as ToolCategory[];
  } catch (error) {
    return [];
  }
}

async function getTool(slug: string): Promise<Tool | null> {
  if (!adminDb) return null;
  const doc = await adminDb.collection('tools').doc(slug).get();
  return doc.exists ? ({ id: doc.id, ...serializeData(doc.data()) } as Tool) : null;
}

export default async function EditToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [tool, categories] = await Promise.all([
    getTool(slug),
    getCategories()
  ]);

  if (!tool) {
    notFound(); // Redirects to 404 if tool is not found
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href="/admin/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Tools
        </Link>
        <h1 className="text-2xl font-bold mt-4">Edit {tool.name}</h1>
        <p className="text-muted-foreground mt-1">Update tool details, features, or regenerate AI insights.</p>
      </div>

      <ToolForm initialData={tool} categories={categories} isEdit={true} />
    </div>
  );
}
