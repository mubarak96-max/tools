import { adminDb } from "@/lib/firebase-admin";
import { Tool, CustomPage } from "@/types/database";
import { notFound } from "next/navigation";
import PageForm from "@/components/admin/PageForm";
import Link from "next/link";
import { serializeData } from "@/lib/utils";

async function getPage(slug: string): Promise<CustomPage | null> {
  if (!slug || slug.startsWith('[') || slug === 'undefined') return null;
  if (!adminDb) return null;
  const doc = await adminDb.collection('pages').doc(slug).get();
  return doc.exists ? ({ id: doc.id, ...serializeData(doc.data()) } as CustomPage) : null;
}

async function getAvailableTools(): Promise<Tool[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection('tools').orderBy('name').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as Tool[];
}

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, tools] = await Promise.all([
    getPage(slug),
    getAvailableTools()
  ]);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Custom Pages
        </Link>
        <h1 className="text-2xl font-bold mt-4">Edit Page: {page.title}</h1>
      </div>

      <PageForm initialData={page} availableTools={tools} isEdit={true} />
    </div>
  );
}
