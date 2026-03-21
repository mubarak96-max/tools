import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

async function getTool(slug: string): Promise<Tool | null> {
  const doc = await adminDb.collection('tools').doc(slug).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Tool) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug.includes('-vs-')) return { title: 'Comparison Not Found' };
  const [slug1, slug2] = slug.split('-vs-');
  const tool1 = await getTool(slug1);
  const tool2 = await getTool(slug2);
  
  if (!tool1 || !tool2) return { title: 'Comparison Not Found' };
  
  return {
    title: `${tool1.name} vs ${tool2.name} (2026 Comparison)`,
    description: `Which is better: ${tool1.name} or ${tool2.name}? Compare pricing, features, and expert insights to make the right choice.`,
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug.includes('-vs-')) {
    notFound();
  }

  const [slug1, slug2] = slug.split('-vs-');
  const tool1 = await getTool(slug1);
  const tool2 = await getTool(slug2);

  if (!tool1 || !tool2) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative pt-12 md:pt-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <span>Head to Head Comparison</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          <span className="text-gradient-primary">{tool1.name}</span> vs <span className="text-gradient-primary">{tool2.name}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Not sure which tool is right for you? Compare {tool1.name} and {tool2.name} based on features, pricing, and our AI analysis.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Tool 1 Column */}
        <div className="glass-card p-8 rounded-2xl flex flex-col h-full border-t-4 border-t-blue-500">
          <h2 className="text-3xl font-bold mb-2">{tool1.name}</h2>
          <p className="text-muted-foreground mb-6 h-20 line-clamp-3">{tool1.description}</p>
          
          <div className="bg-background/50 rounded-xl p-4 mb-6">
            <span className="text-sm text-muted-foreground block mb-1">Pricing</span>
            <span className="text-lg font-semibold">{tool1.pricingRange}</span>
            <span className="text-sm text-muted-foreground block mt-1">({tool1.pricing})</span>
          </div>

          <h3 className="font-semibold mb-3">Key Features:</h3>
          <ul className="space-y-2 mb-8 flex-grow">
            {tool1.features.map(f => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground items-start">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <Link href={`/tools/${tool1.slug}`} className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
              Review {tool1.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tool 2 Column */}
        <div className="glass-card p-8 rounded-2xl flex flex-col h-full border-t-4 border-t-purple-500">
          <h2 className="text-3xl font-bold mb-2">{tool2.name}</h2>
          <p className="text-muted-foreground mb-6 h-20 line-clamp-3">{tool2.description}</p>
          
          <div className="bg-background/50 rounded-xl p-4 mb-6">
            <span className="text-sm text-muted-foreground block mb-1">Pricing</span>
            <span className="text-lg font-semibold">{tool2.pricingRange}</span>
            <span className="text-sm text-muted-foreground block mt-1">({tool2.pricing})</span>
          </div>

          <h3 className="font-semibold mb-3">Key Features:</h3>
          <ul className="space-y-2 mb-8 flex-grow">
            {tool2.features.map(f => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground items-start">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <Link href={`/tools/${tool2.slug}`} className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-foreground font-semibold hover:bg-white/20 transition-all">
              Review {tool2.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* AI Comparison Summary (If available from either) */}
      {(tool1.aiInsights?.comparisonSummary || tool2.aiInsights?.comparisonSummary) && (
        <section className="glass-card p-8 rounded-2xl mt-4 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             AI Verdict
          </h3>
          <div className="space-y-4">
            {tool1.aiInsights?.comparisonSummary && (
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{tool1.name} perspective:</strong> "{tool1.aiInsights.comparisonSummary}"
              </p>
            )}
            {tool2.aiInsights?.comparisonSummary && (
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{tool2.name} perspective:</strong> "{tool2.aiInsights.comparisonSummary}"
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
