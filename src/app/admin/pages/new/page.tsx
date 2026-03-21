import PageForm from "@/components/admin/PageForm";
import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import Link from 'next/link';
import { serializeData } from "@/lib/utils";

async function getAvailableTools(): Promise<Tool[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('tools').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as Tool[];
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

export default async function NewCustomPage() {
  const tools = await getAvailableTools();
  
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Custom Pages
        </Link>
        <h1 className="text-2xl font-bold mt-4">Create Custom Page</h1>
        <p className="text-muted-foreground mt-1">Design a new programmatic SEO template page by grouping tools.</p>
      </div>

      <PageForm availableTools={tools} isEdit={false} />
    </div>
  );
}
