import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";
import { BLOG_POSTS, formatPostDate } from "@/lib/blog/posts";

const PAGE_PATH = "/blog";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Blog — Guides by Mubarak Mutesasira",
  description: "Practical guides on finance, real estate, SEO, and digital tools. Written by Mubarak Mutesasira.",
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function BlogIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, deep dives, and practical guides to help you master digital tools and data translation.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {post.tag}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {formatPostDate(post.datePublished)} - {post.readTime}
              </span>
            </div>

            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors mb-4 leading-tight">
              {post.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {post.description}
            </p>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <AuthorSection />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
