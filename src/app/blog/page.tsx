import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Blog | FindBest Tools",
  description: "Guides, tutorials, and practical tips on code formatting, data conversion, and developer utilities.",
  alternates: {
    canonical: PAGE_URL,
  },
};

const posts = [
  {
    title: "How to Convert Text to Binary (and Binary Back to Text)",
    description: "A complete guide to binary code translation — how it works, worked examples, and ASCII reference tables.",
    href: "/blog/how-to-convert-text-to-binary",
    tag: "Guide",
    readTime: "8 min read",
    date: "April 2026",
  },
  {
    title: "Binary Code Translation for Developers: Practical Use Cases",
    description: "Discover how binary code translators aid in debugging, data inspection, and understanding character encodings.",
    href: "/blog/binary-code-translation-for-developers",
    tag: "Developer",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    title: "Binary Basics: Understanding the Language of Computers",
    description: "Demystify binary code! Learn what binary is, how it works, and its role as the fundamental language of all digital systems.",
    href: "/blog/understanding-binary-code",
    tag: "Basics",
    readTime: "5 min read",
    date: "April 2026",
  },
  {
    title: "Binary Code in Cybersecurity: Decoding Hidden Messages and CTF Challenges",
    description: "Uncover the secrets of binary in cybersecurity! Learn how binary code is used in CTF challenges, forensics, and more.",
    href: "/blog/binary-code-in-cybersecurity",
    tag: "Security",
    readTime: "7 min read",
    date: "April 2026",
  },
];

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
        {posts.map((post) => (
          <Link 
            key={post.href} 
            href={post.href}
            className="group block bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {post.tag}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {post.date} · {post.readTime}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors mb-4 leading-tight">
              {post.title}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              {post.description}
            </p>
            
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
              Read Article 
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M6 12L10 8L6 4" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
