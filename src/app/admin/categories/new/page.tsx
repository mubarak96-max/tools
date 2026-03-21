import CategoryForm from "@/components/admin/CategoryForm";
import Link from 'next/link';

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to Categories
        </Link>
        <h1 className="text-2xl font-bold mt-4">Add New Category</h1>
        <p className="text-muted-foreground mt-1">Create a new taxonomy category for your tools.</p>
      </div>

      <CategoryForm isEdit={false} />
    </div>
  );
}
