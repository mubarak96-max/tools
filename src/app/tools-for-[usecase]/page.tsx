import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import ToolCard from "@/components/ToolCard";
import { Metadata } from 'next';
import Link from "next/link";

export const revalidate = 3600;

function formatUseCase(slug: string) {
  if (!slug || slug.startsWith('[') || slug === 'undefined') return 'Tools';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function getToolsForUseCase(useCaseSlug: string): Promise<Tool[]> {
  if (!useCaseSlug || useCaseSlug.startsWith('[') || useCaseSlug === 'undefined') return [];
  const formattedUseCase = formatUseCase(useCaseSlug);
  try {
    const snapshot = await adminDb.collection('tools')
      .where('useCases', 'array-contains', formattedUseCase)
      .limit(12)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tool[];
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ usecase: string }> }): Promise<Metadata> {
  const { usecase } = await params;
  if (!usecase || usecase.startsWith('[') || usecase === 'undefined') return { title: 'AI Tools' };
  const title = formatUseCase(usecase);
  return {
    title: `Best Tools for ${title} in 2026`,
    description: `Discover the best curated software and AI tools for ${title}. Compare pricing, features, and expert AI insights.`,
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ usecase: string }> }) {
  const { usecase } = await params;
  if (!usecase || usecase.startsWith('[') || usecase === 'undefined') {
     return <div className="py-20 text-center">Loading...</div>;
  }
  const tools = await getToolsForUseCase(usecase);
  const title = formatUseCase(usecase);

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative pt-12 md:pt-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Best Tools for <span className="text-gradient-primary">{title}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We've analyzed the market to bring you the top-rated software and AI solutions specifically curated for {title.toLowerCase()}.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-foreground">Top Recommendations</h2>
          <span className="text-muted-foreground">{tools.length} results found</span>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">No specific tools found.</h3>
            <p className="text-muted-foreground mb-6">We're constantly adding new tools to our directory. Check back soon for {title.toLowerCase()} tools.</p>
            <Link href="/" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium">
              Browse all categories
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
