import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import ToolCard from "@/components/ToolCard";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 3600;

async function getTargetTool(slug: string): Promise<Tool | null> {
  if (!slug || slug.startsWith('[') || slug === 'undefined') return null;
  const doc = await adminDb.collection('tools').doc(slug).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Tool) : null;
}

// Find alternatives by matching Category
async function getAlternatives(targetTool: Tool): Promise<Tool[]> {
  try {
    const snapshot = await adminDb.collection('tools')
      .where('category', '==', targetTool.category)
      .limit(10)
      .get();
      
    const tools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tool[];
    return tools.filter(t => t.slug !== targetTool.slug);
  } catch (error) {
    console.error("Error fetching alternatives:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTargetTool(slug);
  if (!tool) return { title: 'Not Found' };
  
  return {
    title: `Top ${tool.name} Alternatives & Competitors (2026)`,
    description: `Looking for a better, cheaper, or different tool than ${tool.name}? Discover the best alternatives based on use case and expert AI insights.`,
  };
}

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const targetTool = await getTargetTool(slug);
  if (!targetTool) notFound();

  const alternatives = await getAlternatives(targetTool);

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative pt-12 md:pt-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Best alternatives to <span className="text-gradient-primary">{targetTool.name}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Whether you need something cheaper, simpler, or more powerful, explore top-rated competitors to {targetTool.name} analyzed by AI.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-foreground">Competitors & Replacements</h2>
        </div>

        {alternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">No alternatives found.</h3>
            <p className="text-muted-foreground mb-6">{targetTool.name} is currently the only tool we have in the {targetTool.category} category.</p>
            <Link href={`/tools/${targetTool.slug}`} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all text-sm">
              View {targetTool.name} Details
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
