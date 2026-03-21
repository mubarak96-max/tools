import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import ToolCard from "@/components/ToolCard";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering if we want real-time updates, or leave static with revalidate
export const revalidate = 3600; // Revalidate every hour

async function getFeaturedTools(): Promise<Tool[]> {
  try {
    const snapshot = await adminDb.collection('tools').limit(6).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tool[];
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

export default async function Home() {
  const tools = await getFeaturedTools();

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Tool Discovery</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-gradient">
          Find the perfect tool <br className="hidden md:block" />
          <span className="text-gradient-primary">for your next project</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Stop scrolling through generic listicles. Discover curated software and AI tools matched precisely to your use case, budget, and skill level.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/tools" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(120,119,198,0.5)] transition-all flex items-center justify-center gap-2">
            Browse All Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/categories" className="px-8 py-4 rounded-xl glass font-semibold hover:bg-white/5 transition-all text-foreground">
            Explore Categories
          </Link>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Tools</h2>
            <p className="text-muted-foreground mt-2">Hand-picked solutions for modern workflows.</p>
          </div>
          <Link href="/tools" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 group">
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl">
            <p className="text-muted-foreground text-lg">No tools found. Run the seeder script to populate data!</p>
          </div>
        )}
      </section>
    </div>
  );
}
