import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary-soft text-primary shadow-[0_18px_40px_-28px_rgba(79,70,229,0.4)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
            findmytool
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/tools" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            All Tools
          </Link>
          <Link href="/tools?q=free" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            Free Tools
          </Link>
          <Link href="/tools?q=compare" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            Compare
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.2)] md:flex"
          >
            <Search className="h-4 w-4" />
            Search the directory
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5"
          >
            Admin
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
