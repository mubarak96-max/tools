import Link from "next/link";
import {
  ArrowUpRight,
  LayoutDashboard,
  ListChecks,
  Files,
  Tags,
  ArrowRightLeft,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | findmytool",
  robots: {
    index: false,
    follow: false,
  },
};

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/tools", label: "Tools", icon: Wrench },
  { href: "/admin/pages", label: "Pages", icon: Files },
  { href: "/admin/comparisons", label: "Comparisons", icon: ArrowRightLeft },
  { href: "/admin/review", label: "Review Queue", icon: ListChecks },
  { href: "/admin/categories", label: "Taxonomies", icon: Tags },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background !pt-0">
      <aside className="hidden w-72 shrink-0 border-r border-border/70 bg-card/70 p-5 md:flex md:flex-col">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-[1.5rem] border border-border/70 bg-background/65 px-4 py-4 shadow-[0_20px_42px_-34px_rgba(17,31,55,0.45)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">findmytool Admin</p>
            <p className="text-xs text-muted-foreground">Publishing workflow</p>
          </div>
        </Link>

        <nav className="mt-8 flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Live Site
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check the public experience after publishing or editing records.
          </p>
          <Link
            href="/"
            target="_blank"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            Open site
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border/70 bg-card/60 px-4 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">findmytool Admin</span>
            <Link href="/" className="text-sm font-medium text-primary">
              Live Site
            </Link>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
