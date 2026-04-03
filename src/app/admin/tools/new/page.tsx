import ToolForm from "@/components/admin/ToolForm";
import { listCategories } from "@/lib/db/taxonomies";
import Link from 'next/link';
import type { ToolCategory } from "@/types/database";

async function getCategories(): Promise<ToolCategory[]> {
  return listCategories();
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
