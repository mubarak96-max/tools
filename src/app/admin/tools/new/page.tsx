import ToolForm from "@/components/admin/ToolForm";
import Link from 'next/link';
import { adminDb } from "@/lib/firebase-admin";
import { ToolCategory } from "@/types/database";
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

export default async function NewToolPage() {
  const categories = await getCategories();
  
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Tools
        </Link>
        <h1 className="text-2xl font-bold mt-4">Add New Tool</h1>
        <p className="text-muted-foreground mt-1">Create a new tool to list in the directory.</p>
      </div>

      <ToolForm categories={categories} isEdit={false} />
    </div>
  );
}
