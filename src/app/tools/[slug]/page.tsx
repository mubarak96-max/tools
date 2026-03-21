import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, Zap, Target, AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

export const revalidate = 3600;

async function getTool(slug: string): Promise<Tool | null> {
  if (!slug || slug.startsWith('[') || slug === 'undefined') return null;
  try {
    const doc = await adminDb.collection('tools').doc(slug).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Tool;
  } catch (error) {
    console.error("Error fetching tool:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) return { title: 'Tool Not Found' };
  
  return {
    title: `${tool.name} Review, Pricing & AI Insights (2026)`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    notFound();
  }

  // Generate JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: tool.platforms.join(', '),
    offers: {
      '@type': 'Offer',
      price: tool.pricingRange.replace(/[^0-9.]/g, ''), // Minimal extraction
      priceCurrency: 'USD',
    },
    review: tool.aiInsights ? {
      '@type': 'Review',
      reviewBody: tool.aiInsights.whyThisToolFits,
      author: {
        '@type': 'Organization',
        name: 'findmytool'
      }
    } : undefined
  };

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Tool Hero */}
      <section className="relative pt-12 md:pt-20">
        <Link href="/tools" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-8 w-fit transition-colors">
          &larr; Back to Tools
        </Link>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
              {tool.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {tool.description}
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl w-full lg:w-96 flex-shrink-0">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-white/10 pb-4">Key Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">{tool.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium text-foreground">{tool.difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pricing</span>
                <span className="font-medium text-foreground">{tool.pricing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Range</span>
                <span className="font-medium text-foreground">{tool.pricingRange}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10">
                <a href="#" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
                  Visit Website
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      {tool.aiInsights && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-card p-8 rounded-2xl bg-primary/5 border-primary/20">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Zap className="w-5 h-5 text-primary" /> The Bottom Line
            </h2>
            <p className="text-muted-foreground leading-relaxed">{tool.aiInsights.whyThisToolFits}</p>
          </div>

          <div className="glass-card p-8 rounded-2xl bg-white/5 border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Target className="w-5 h-5 text-accent" /> Best For
            </h2>
            <p className="text-muted-foreground leading-relaxed">{tool.aiInsights.bestFor}</p>
          </div>

          <div className="glass-card p-8 rounded-2xl md:col-span-2 bg-gradient-to-r from-red-500/5 to-transparent border-red-500/10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <AlertTriangle className="w-5 h-5 text-red-400" /> Who Should Avoid This
            </h2>
            <p className="text-muted-foreground leading-relaxed text-red-200/70">{tool.aiInsights.antiRecommendation}</p>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
        {/* Left Column: Pros & Cons & Features */}
        <div className="lg:col-span-2 space-y-12">
          {tool.aiInsights && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl border-green-500/20 bg-green-500/5">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.aiInsights.pros.map((pro, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                      <span className="text-green-500 mt-0.5">•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-6 rounded-2xl border-red-500/20 bg-red-500/5">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.aiInsights.cons.map((con, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                      <span className="text-red-500 mt-0.5">•</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Layers className="w-6 h-6 text-primary" /> {(tool.integrations || []).length > 0 ? "Features & Integrations" : "Core Features"}
            </h2>
            <div className={`grid grid-cols-1 ${(tool.integrations || []).length > 0 ? "sm:grid-cols-2" : ""} gap-8`}>
              <div>
                <ul className="space-y-3">
                  {(tool.features || []).map(f => (
                    <li key={f} className="text-foreground flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0 mt-2" />
                      <span className="flex-1 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {(tool.integrations || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Integrations</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.integrations!.map(i => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Platform & Use Cases */}
        <div className="space-y-8">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Use Cases</h3>
            <div className="flex flex-wrap gap-2">
              {(tool.useCases || []).map(uc => (
                <Link key={uc} href={`/tools-for-${uc.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {uc}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {(tool.platforms || []).map(p => (
                <span key={p} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>
          
          {tool.aiInsights?.comparisonSummary && (
             <div className="glass p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Comparison Verdict</h3>
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "{tool.aiInsights.comparisonSummary}"
              </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
