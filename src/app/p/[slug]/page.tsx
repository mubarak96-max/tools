import { adminDb } from "@/lib/firebase-admin";
import { CustomPage, Tool } from "@/types/database";
import ToolCard from "@/components/ToolCard";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

async function getPage(slug: string): Promise<CustomPage | null> {
  if (!slug || slug.startsWith('[') || slug === 'undefined') return null;
  const doc = await adminDb.collection('pages').doc(slug).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as CustomPage) : null;
}

async function getToolsForPage(toolSlugs: string[]): Promise<Tool[]> {
  if (!toolSlugs || toolSlugs.length === 0) return [];
  
  try {
    const refs = toolSlugs.map(slug => adminDb.collection('tools').doc(slug));
    const snapshots = await adminDb.getAll(...refs);
    
    return snapshots
      .filter(snap => snap.exists)
      .map(snap => ({ id: snap.id, ...snap.data() } as Tool));
  } catch (error) {
    console.error("Error fetching specific tools for page:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: 'Not Found' };
  
  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function CustomDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  // Load the manually mapped tools based on the template
  const tools = await getToolsForPage(page.toolSlugs || []);

  // --------------- TEMPLATE 1: COMPARISON ---------------
  if (page.templateType === 'comparison' && tools.length >= 2) {
    const tool1 = tools[0];
    const tool2 = tools[1];
    
    return (
      <div className="flex flex-col gap-12 pb-24 animate-fade-in">
        <section className="relative pt-12 md:pt-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span>Head to Head Comparison</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
            {page.title}
          </h1>
          {page.editorialVerdict ? (
            <div 
              className="text-lg text-muted-foreground max-w-3xl mx-auto text-left glass-card p-6 md:p-8 rounded-2xl mt-8 mb-8 leading-relaxed prose prose-invert prose-p:mb-4 last:prose-p:mb-0"
              dangerouslySetInnerHTML={{ __html: page.editorialVerdict }}
            />
          ) : (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 mt-6">
              {page.metaDescription}
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="glass-card p-8 rounded-2xl flex flex-col h-full border-t-4 border-t-blue-500">
            <h2 className="text-3xl font-bold mb-2">{tool1.name}</h2>
            <p className="text-muted-foreground mb-6 h-20 line-clamp-3">{tool1.description}</p>
            
            <div className="bg-background/50 rounded-xl p-4 mb-6">
              <span className="text-sm text-muted-foreground block mb-1">Pricing</span>
              <span className="text-lg font-semibold">{tool1.pricingRange || tool1.pricing}</span>
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
                Review {tool1.name} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl flex flex-col h-full border-t-4 border-t-purple-500">
            <h2 className="text-3xl font-bold mb-2">{tool2.name}</h2>
            <p className="text-muted-foreground mb-6 h-20 line-clamp-3">{tool2.description}</p>
            
            <div className="bg-background/50 rounded-xl p-4 mb-6">
              <span className="text-sm text-muted-foreground block mb-1">Pricing</span>
              <span className="text-lg font-semibold">{tool2.pricingRange || tool2.pricing}</span>
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
              <Link href={`/tools/${tool2.slug}`} className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20 transition-all text-white">
                Review {tool2.name} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --------------- TEMPLATE 2: ALTERNATIVES ---------------
  if (page.templateType === 'alternatives' && tools.length > 0) {
    const targetTool = tools[0]; // First tool checked is treated as the target
    const alternatives = tools.slice(1);
    
    return (
      <div className="flex flex-col gap-12 pb-24 animate-fade-in">
        <section className="relative pt-12 md:pt-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            <span>{targetTool.category || 'Software'} Alternatives</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground mx-auto max-w-4xl">
            {page.title}
          </h1>
          {page.editorialVerdict ? (
            <div 
              className="text-lg text-muted-foreground max-w-3xl mx-auto text-left glass-card p-6 md:p-8 rounded-2xl mt-8 mb-8 leading-relaxed prose prose-invert prose-p:mb-4 last:prose-p:mb-0 border-red-500/10"
              dangerouslySetInnerHTML={{ __html: page.editorialVerdict }}
            />
          ) : (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-6 mb-8">
              {page.metaDescription}
            </p>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold text-foreground">Competitors & Replacements to {targetTool.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
            {alternatives.length === 0 && (
              <p className="text-muted-foreground col-span-full">You must select more than 1 tool to display alternatives.</p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // --------------- TEMPLATE 3: CURATED LIST (Fallback) ---------------
  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative pt-12 md:pt-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
          {page.title.split(' ').map((word, i, arr) => {
             if (i >= arr.length - 2) return <span key={i} className="text-gradient-primary" style={{ display: "inline-block" }}> {word}</span>;
             return ' ' + word;
          })}
        </h1>
        {page.editorialVerdict ? (
          <div 
            className="text-lg text-muted-foreground max-w-3xl mx-auto text-left glass-card p-6 md:p-8 rounded-2xl mt-8 mb-8 leading-relaxed prose prose-invert prose-p:mb-4 last:prose-p:mb-0 border-primary/10"
            dangerouslySetInnerHTML={{ __html: page.editorialVerdict }}
          />
        ) : (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6 mb-8">
            {page.metaDescription}
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-foreground">Top Recommendations</h2>
          <span className="text-muted-foreground">{tools.length} curated tools</span>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">No tools selected for this page.</h3>
            <p className="text-muted-foreground mb-6">If you are the admin, edit this page and select tools.</p>
          </div>
        )}
      </section>
    </div>
  );
}
