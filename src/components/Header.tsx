import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-card/92 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="findbesttool"
              width={182}
              height={42}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/tools" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            All Tools
          </Link>
          <Link href="/ai" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            AI
          </Link>
          <Link href="/finance" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            Finance
          </Link>
          <Link href="/text" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            Text
          </Link>
          <Link href="/tools?q=compare" className="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
            Compare
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-2xl border border-border bg-card text-slate-700 transition-colors hover:border-primary/20 hover:text-primary">
              <Menu className="h-5 w-5" />
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[1.25rem] border border-border bg-card p-3 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.16)]">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/tools"
                  className="rounded-[0.95rem] px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-muted hover:text-primary"
                >
                  All Tools
                </Link>
                <Link
                  href="/ai"
                  className="rounded-[0.95rem] px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-muted hover:text-primary"
                >
                  AI
                </Link>
                <Link
                  href="/finance"
                  className="rounded-[0.95rem] px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-muted hover:text-primary"
                >
                  Finance
                </Link>
                <Link
                  href="/text"
                  className="rounded-[0.95rem] px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-muted hover:text-primary"
                >
                  Text
                </Link>
                <Link
                  href="/tools?q=compare"
                  className="rounded-[0.95rem] px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-muted hover:text-primary"
                >
                  Compare
                </Link>
              </nav>
            </div>
          </details>

          <Link
            href="/tools"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-slate-700 md:flex"
          >
            <Search className="h-4 w-4" />
            Search the directory
          </Link>
        </div>
      </div>
    </header>
  );
}
