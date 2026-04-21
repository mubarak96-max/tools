import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/design";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const tools = [
  {
    name: "Free Social Media Carousel Builder",
    href: "/design/free-social-media-carousel-builder",
    description: "Create Instagram, LinkedIn, and TikTok carousel posts with templates, continuous backgrounds, and export options.",
  },
];

export const metadata: Metadata = {
  title: "Design Tools | FindBest Tools",
  description: "Free browser-based design utilities for creating social media assets and visual content.",
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function DesignToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Design Tools</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Design Tools</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Practical tools for building visual content directly in your browser.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground group-hover:text-primary">{tool.name}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{tool.description}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-primary">Open tool</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
