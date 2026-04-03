import PageForm from "@/components/admin/PageForm";
import { listTools } from "@/lib/db/tools";
import Link from 'next/link';
import type { Tool } from "@/types/database";

async function getAvailableTools(): Promise<Tool[]> {
  return listTools();
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
