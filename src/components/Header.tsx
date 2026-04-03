import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-gradient-primary">
            findmytool
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            All Tools
          </Link>
          <Link href="/tools?q=free" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Free Tools
          </Link>
          <Link href="/tools?q=compare" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Compare
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            className="hidden items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground md:flex"
          >
            <Search className="h-4 w-4" />
            Search the directory
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/10 hover:-translate-y-0.5"
          >
            Admin
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
