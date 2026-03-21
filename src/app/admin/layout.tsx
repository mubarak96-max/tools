import Link from 'next/link';
import { Settings, Wrench, Home, Search } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | Tool Intelligence',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background !pt-0">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card flex-col h-full hidden md:flex z-50">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
             <Wrench className="w-5 h-5 text-primary" /> Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin/tools" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group">
            <Wrench className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="font-medium text-sm">Tools Database</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group">
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="font-medium text-sm">Categories</span>
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group">
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="font-medium text-sm">Custom Pages</span>
          </Link>
          
          <div className="pt-6 mt-6 border-t border-white/5">
            <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group">
              <Home className="w-4 h-4" />
              <span className="font-medium text-sm">View Live Site</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background/50 relative pt-16 md:pt-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-card fixed top-0 left-0 right-0 z-40">
          <span className="font-bold text-lg">Admin Panel</span>
          <Link href="/" className="text-sm text-primary">Live Site</Link>
        </div>
        
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
