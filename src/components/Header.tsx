import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <Link href="/" className="text-xl font-bold tracking-tight text-gradient-primary">
            findmytool
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            All Tools
          </Link>
          <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
        </div>

        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
