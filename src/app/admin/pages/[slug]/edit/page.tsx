import PageForm from "@/components/admin/PageForm";
import { getPageBySlug } from "@/lib/db/pages";
import { listTools } from "@/lib/db/tools";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Tool, CustomPage } from "@/types/database";

async function getPage(slug: string): Promise<CustomPage | null> {
  return getPageBySlug(slug, { includeDrafts: true });
}

async function getAvailableTools(): Promise<Tool[]> {
  return listTools();
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
