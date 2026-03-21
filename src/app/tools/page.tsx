import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import ToolCard from "@/components/ToolCard";
import { Metadata } from 'next';
import { Layers } from "lucide-react";
import { serializeData } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All AI Tools & Software Directory (2026)",
  description: "Browse our complete directory of top-rated AI tools and software platforms, thoroughly analyzed by AI.",
};

async function getAllTools(): Promise<Tool[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection('tools').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...serializeData(doc.data()) })) as Tool[];
  } catch (error) {
    console.error("Error fetching all tools:", error);
    return [];
  }
}

export default async function AllToolsPage() {
  const tools = await getAllTools();

  return (
    <div className="flex flex-col gap-12 pb-24 animate-fade-in">
      <section className="relative pt-12 md:pt-20 text-center">

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Explore <span className="text-gradient-primary">Tools</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse through a directory of the best software and AI platforms currently dominating the market!
        </p>
      </section>

      <section>


        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool: Tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl">
            <h3 className="text-xl font-semibold mb-2">No tools available yet.</h3>
            <p className="text-muted-foreground">We are actively building our database. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
