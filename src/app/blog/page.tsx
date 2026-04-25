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
    title: "Diminishing Musharakah vs Murabaha vs Ijara: Which Halal Mortgage Structure Saves You Money?",
    description: "Compare Sharia-compliant mortgage structures side-by-side with real numbers. See which structure costs less for your home purchase in 2026.",
    href: "/blog/halal-mortgage-structure-comparison",
    tag: "Islamic Finance",
    readTime: "9 min read",
    date: "April 2026",
  },
  {
    title: "Condo vs. Co-op in NYC: How Closing Costs and Transfer Taxes Differ",
    description: "The financial side of the decision: why co-op buyers save $20k+ on closing costs compared to condos, and when a flip tax changes the math.",
    href: "/blog/nyc-condo-vs-coop-closing-costs",
    tag: "Property Types",
    readTime: "12 min read",
    date: "April 2026",
  },
  {
    title: "Sponsor Sales in NYC: Why Your Closing Costs Are Higher Than You Think",
    description: "The truth about new development: how the 'Transfer Tax Flip' and sponsor fees can add $40k+ to your NYC closing costs.",
    href: "/blog/nyc-sponsor-sales-closing-costs",
    tag: "New Development",
    readTime: "12 min read",
    date: "April 2026",
  },
  {
    title: "NYC Transfer Tax on Investment Properties: What Investors Need to Know (2026)",
    description: "Navigate high-value NYC real estate taxes: commercial RPTT, entity transfers, and the full tax stack for property investors.",
    href: "/blog/nyc-investment-property-transfer-tax",
    tag: "Investment",
    readTime: "11 min read",
    date: "April 2026",
  },
  {
    title: "Who Pays Transfer Tax in NYC? Seller Closing Costs Explained (2026)",
    description: "Selling an apartment in New York? Learn about RPTT, State transfer taxes, and why sponsor sales change the rules for sellers.",
    href: "/blog/who-pays-transfer-tax-nyc",
    tag: "Real Estate",
    readTime: "10 min read",
    date: "April 2026",
  },
  {
    title: "NYC Closing Costs in 2026: The Complete Buyer's Guide",
    description: "Navigate NYC's complex closing costs, from Mansion Tax to Mortgage Recording Tax, with our detailed 2026 breakdown for condos, co-ops, and houses.",
    href: "/blog/nyc-closing-costs-2026",
    tag: "Real Estate",
    readTime: "12 min read",
    date: "April 2026",
  },
  {
    title: "How to Write a Carousel Caption That Gets Engagement (2026 Guide)",
    description: "Your caption is your second hook. Master the 4-part carousel caption formula for Instagram and LinkedIn to drive more swipes, saves, and comments.",
    href: "/blog/carousel-caption-guide",
    tag: "Copywriting",
    readTime: "9 min read",
    date: "April 2026",
  },
  {
    title: "How to Make a Carousel Go Viral in 2026: Tactics That Actually Work",
    description: "Learn the specific engagement tactics, from value delay to continuous backgrounds, that force Instagram and LinkedIn algorithms to boost your reach.",
    href: "/blog/how-to-make-a-carousel-go-viral",
    tag: "Growth Strategy",
    readTime: "13 min read",
    date: "April 2026",
  },
  {
    title: "7 Free Canva Alternatives for Making Social Media Carousels in 2026",
    description: "Discover the best dedicated carousel builders that produce no-watermark, high-res slides for Instagram and LinkedIn without a Canva subscription.",
    href: "/blog/free-carousel-maker-no-canva",
    tag: "Tool Comparison",
    readTime: "11 min read",
    date: "April 2026",
  },
  {
    title: "How to Make a LinkedIn Carousel in 2026: The Complete Guide",
    description: "Master LinkedIn document posts. Learn the viral hook formulas, PDF specs, and design rules that drive B2B engagement and reach.",
    href: "/blog/how-to-make-a-linkedin-carousel",
    tag: "LinkedIn Guide",
    readTime: "12 min read",
    date: "April 2026",
  },
  {
    title: "Instagram Carousel Size Guide for 2026: Every Dimension You Need to Get Right",
    description: "Master Instagram carousel aspect ratios, safe zones, and export settings for sharp text across square, portrait, and tall formats.",
    href: "/blog/instagram-carousel-size",
    tag: "Design Guide",
    readTime: "10 min read",
    date: "April 2026",
  },
  {
    title: "How to Convert Text to Binary (and Binary Back to Text)",
    description: "A complete guide to binary code translation, how it works, worked examples, and ASCII reference tables.",
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
    description: "Demystify binary code. Learn what binary is, how it works, and its role as the fundamental language of all digital systems.",
    href: "/blog/understanding-binary-code",
    tag: "Basics",
    readTime: "5 min read",
    date: "April 2026",
  },
  {
    title: "Binary Code in Cybersecurity: Decoding Hidden Messages and CTF Challenges",
    description: "Uncover the role of binary in cybersecurity, including CTF challenges, forensics, and hidden-message workflows.",
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
                {post.date} - {post.readTime}
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
