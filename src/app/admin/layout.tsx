import Link from "next/link";

import AdminShellNav from "@/components/admin/AdminShellNav";
import { listPages } from "@/lib/db/pages";
import { listTools } from "@/lib/db/tools";

export const metadata = {
  title: "Admin Dashboard | findbesttool",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [tools, pages] = await Promise.all([listTools(), listPages()]);

  const reviewCount =
    tools.filter((tool) => tool.status === "review").length +
    pages.filter((page) => page.status === "review").length;
  const lowConfidenceCount = tools.filter((tool) => (tool.sourceConfidence ?? 1) < 0.6).length;

  return (
    <div className="min-h-screen bg-background !pt-0 md:flex">
      <AdminShellNav
        toolCount={tools.length}
        reviewCount={reviewCount}
        lowConfidenceCount={lowConfidenceCount}
      />

      <main className="min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="hidden h-[52px] items-center justify-between border-b border-border bg-card px-6 lg:flex">
          <div>
            <p className="text-sm font-semibold text-foreground">Admin workspace</p>
            <p className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-[0.9rem] border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
              Search records...
            </div>
            <button className="rounded-[0.9rem] border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Export
            </button>
            <Link
              href="/admin/tools/new"
              className="rounded-[0.9rem] bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              + Add tool
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
