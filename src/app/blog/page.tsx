import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";

const PAGE_PATH = "/blog";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Blog — Guides by Mubarak Mutesasira",
  description: "Practical guides on finance, real estate, SEO, and digital tools. Written by Mubarak Mutesasira.",
  alternates: {
    canonical: PAGE_URL,
  },
};

const posts = [
  {
    title: "xG by Position: Comparing Strikers, Midfielders & Defenders",
    description: "Expected goals means something very different depending on position. This guide breaks down what good xG looks like for every role on the pitch.",
    href: "/blog/xg-by-position-benchmarks",
    tag: "Positional Analysis",
    readTime: "20 min read",
    date: "May 2026",
  },
  {
    title: "FBref vs Understat vs Opta: Why Different xG Numbers Exist for the Same Shot",
    description: "You've looked up a match on FBref and Understat and found different xG values. This guide explains why these disagreements exist and how to handle them.",
    href: "/blog/fbref-vs-understat-vs-opta-xg",
    tag: "Data Providers",
    readTime: "18 min read",
    date: "April 2026",
  },
  {
    title: "xG Per Game: What's a Good Number for Teams and Players?",
    description: "Expected goals numbers mean little without context. This guide gives you the benchmarks for teams, players, and positions to interpret any xG figure.",
    href: "/blog/xg-per-game-benchmarks",
    tag: "Analytics Context",
    readTime: "15 min read",
    date: "March 2026",
  },
  {
    title: "Penalty Kick xG: Why It's ~0.79 and Not 1.0",
    description: "Learn why professional expected goals (xG) models value a penalty at 0.79. Explore the data, psychology, and biomechanics behind football's most dramatic shot.",
    href: "/blog/penalty-kick-xg-explained",
    tag: "Penalty Stats",
    readTime: "10 min read",
    date: "February 2026",
  },
  {
    title: "How is xG Calculated? The Factors Behind Every Shot",
    description: "Ever wondered how expected goals (xG) is actually calculated? This guide explains every input, from distance and angle to body part and assist type.",
    href: "/blog/how-is-xg-calculated",
    tag: "Data Science",
    readTime: "18 min read",
    date: "January 2026",
  },
  {
    title: "What's the Difference Between xG, xGA, npxG, and xGOT?",
    description: "A complete guide to the expected goals family: xG, xGA, npxG, and xGOT. Learn when to use each metric and how they help you read a football match.",
    href: "/blog/difference-between-xg-xga-npxg-xgot",
    tag: "Analytics Deep Dive",
    readTime: "15 min read",
    date: "December 2025",
  },
  {
    title: "What is xG in Football? A Complete Beginner's Guide",
    description: "Learn what expected goals (xG) means, how it's calculated, and why it's the most important metric in modern football analytics.",
    href: "/blog/what-is-xg-in-football",
    tag: "Football Analytics",
    readTime: "12 min read",
    date: "November 2025",
  },
  {
    title: "Free vs. Paid Keyword Clustering Tools: Is It Worth Paying?",
    description: "An honest comparison of free vs. paid keyword clustering tools. Learn what you get for your money and when a free tool is actually all you need.",
    href: "/blog/free-vs-paid-keyword-clustering-tools",
    tag: "SEO Tools",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    title: "How to Build a Content Strategy From a Keyword Cluster (With Examples)",
    description: "Learn how to turn raw keyword clusters into a complete content strategy. A step-by-step guide to mapping pillar pages, supporting articles, and internal links.",
    href: "/blog/how-to-build-content-strategy-from-keyword-cluster",
    tag: "Content Strategy",
    readTime: "8 min read",
    date: "April 2026",
  },
  {
    title: "SERP-Based vs. Semantic Keyword Clustering: Which Method Should You Use?",
    description: "Compare the pros and cons of SERP-based and semantic clustering. Learn which method is best for intent detection and preventing cannibalization.",
    href: "/blog/serp-vs-semantic-keyword-clustering",
    tag: "Keyword Research",
    readTime: "9 min read",
    date: "March 2026",
  },
  {
    title: "Keyword Clustering vs. Keyword Grouping: What's the Difference?",
    description: "Learn the critical distinction between basic keyword grouping and intent-based clustering, and why getting it wrong leads to keyword cannibalization.",
    href: "/blog/keyword-clustering-vs-grouping-difference",
    tag: "SEO Strategy",
    readTime: "7 min read",
    date: "February 2026",
  },
  {
    title: "How to Group Keywords Without a Spreadsheet (Step-by-Step Guide)",
    description: "Stop wasting hours in Excel. Learn how to organize 5,000+ keywords into structured content clusters in seconds using semantic grouping tools.",
    href: "/blog/how-to-group-keywords-without-spreadsheet",
    tag: "SEO Strategy",
    readTime: "8 min read",
    date: "January 2026",
  },
  {
    title: "Instagram Caption Character Limit: Best Length, Preview Cutoff, and Hashtag Rules",
    description: "Learn the real Instagram caption constraint: the 125-character preview. Plus hashtag rules, ideal caption lengths, and a cleaner writing structure.",
    href: "/blog/instagram-caption-character-limit",
    tag: "Instagram",
    readTime: "9 min read",
    date: "January 2026",
  },
  {
    title: "X Character Limit With Links: Why a URL Still Costs 23 Characters",
    description: "Most X counters get link-heavy posts wrong. Learn how weighted URLs affect the 280-character limit and how to budget space for launches and promos.",
    href: "/blog/x-character-limit-with-links",
    tag: "X / Twitter",
    readTime: "8 min read",
    date: "February 2026",
  },
  {
    title: "LinkedIn Post Character Limit: Best Length, Preview Cutoff, and Writing Strategy",
    description: "The challenge on LinkedIn is not 3,000 characters. It is making the first 210 work hard enough to earn the see-more click.",
    href: "/blog/linkedin-post-character-limit",
    tag: "LinkedIn",
    readTime: "9 min read",
    date: "March 2026",
  },
  {
    title: "Threads and Bluesky Character Limits: How to Write for Both Without Guessing",
    description: "Compare Threads and Bluesky limits, practical post lengths, and a safer cross-posting workflow for short-form social writing.",
    href: "/blog/threads-bluesky-character-limits",
    tag: "Social Media",
    readTime: "8 min read",
    date: "April 2026",
  },
  {
    title: "How to Read UTM Reports in Google Analytics 4 (Step-by-Step)",
    description: "Stop guessing and start measuring. Learn exactly where to find your UTM campaign data in GA4, how to interpret metrics, and how to build custom reports.",
    href: "/blog/read-utm-reports-ga4",
    tag: "Analytics",
    readTime: "12 min read",
    date: "May 2026",
  },
  {
    title: "Shopify UTM Tracking: Complete Setup Guide for 2026",
    description: "A complete Shopify merchant guide to UTM parameters, GA4 setup, channel templates, and reducing attribution gaps between Shopify and GA4.",
    href: "/blog/shopify-utm-tracking",
    tag: "Shopify",
    readTime: "15 min read",
    date: "May 2026",
  },
  {
    title: "UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & X",
    description: "Social media attribution is complex. Learn how to structure UTM parameters for every platform to distinguish paid from organic and stories from feed posts.",
    href: "/blog/social-media-utm-tracking",
    tag: "Social Media",
    readTime: "15 min read",
    date: "May 2026",
  },
  {
    title: "How to Track Every Email Campaign with UTM Links (+ Free Template)",
    description: "Email ROI is invisible without proper tracking. Learn how to tag every link to turn 'Direct' traffic into actionable insights and prove your email marketing impact.",
    href: "/blog/track-email-campaigns-utm",
    tag: "Email Marketing",
    readTime: "10 min read",
    date: "April 2026",
  },
  {
    title: "5 UTM Mistakes That Are Ruining Your Campaign Data (And How to Fix Them)",
    description: "Are you making these common tracking errors? Learn how to fix inconsistent naming, internal link tagging, and manual typos to restore your analytics accuracy.",
    href: "/blog/5-utm-mistakes",
    tag: "Data Quality",
    readTime: "12 min read",
    date: "April 2026",
  },
  {
    title: "UTM Naming Conventions: The One Rule That Keeps Your Analytics Clean (2026)",
    description: "Messy UTM data ruins reports. Learn the simple naming convention rules that ensure your campaign data is always clean, accurate, and actionable.",
    href: "/blog/utm-naming-conventions",
    tag: "Strategy",
    readTime: "10 min read",
    date: "March 2026",
  },
  {
    title: "What Are UTM Parameters? A Beginner's Guide to Campaign Tracking (2026)",
    description: "Master the basics of UTM tracking. Learn to use source, medium, and campaign tags to measure ROI accurately and stop guessing where your traffic comes from.",
    href: "/blog/what-are-utm-parameters",
    tag: "Marketing",
    readTime: "8 min read",
    date: "March 2026",
  },
  {
    title: "Second Home Stamp Duty in England: Higher Rates Explained (2026)",
    description: "Understand when the additional dwelling surcharge applies, when a replacement main residence avoids it, and how to model the true SDLT bill.",
    href: "/blog/uk-stamp-duty-second-home-guide",
    tag: "UK Real Estate",
    readTime: "8 min read",
    date: "April 2026",
  },
  {
    title: "What Is SDLT? Stamp Duty vs SDLT Explained for Home Buyers",
    description: "Clarify the difference between stamp duty and SDLT, and why England and Northern Ireland use a different system from Scotland and Wales.",
    href: "/blog/what-is-sdlt-vs-stamp-duty",
    tag: "SDLT Basics",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    title: "Residential Stamp Duty Rates in England: How the SDLT Bands Work",
    description: "Learn the standard residential SDLT structure before first-time buyer relief or second home surcharges change the final amount.",
    href: "/blog/residential-stamp-duty-rates-uk",
    tag: "Residential SDLT",
    readTime: "7 min read",
    date: "April 2026",
  },
  {
    title: "Buy-to-Let Stamp Duty in England: SDLT Guide for Landlords",
    description: "A landlord-focused guide to buy-to-let SDLT, additional dwelling surcharges, and how to model the real upfront acquisition cost.",
    href: "/blog/buy-to-let-stamp-duty-guide-uk",
    tag: "Landlord Guide",
    readTime: "8 min read",
    date: "April 2026",
  },
  {
    title: "First-Time Buyer Stamp Duty Relief in England: Who Qualifies?",
    description: "Understand how first-time buyer relief works, when it applies, and when the calculation falls back to the standard residential SDLT bands.",
    href: "/blog/first-time-buyer-stamp-duty-relief-uk",
    tag: "First-Time Buyer",
    readTime: "7 min read",
    date: "April 2026",
  },
  {
    title: "First-Time Buyer's Guide to Halal Mortgages in the UK (2026)",
    description: "Navigate the journey from deposit to ownership without riba. Our complete step-by-step guide for Sharia-compliant home finance.",
    href: "/blog/first-time-buyer-halal-mortgage-guide-uk",
    tag: "Buying Guide",
    readTime: "12 min read",
    date: "April 2026",
  },
  {
    title: "The 'Hidden' Costs of Islamic Mortgages in the UK: What Lenders Don't Tell You",
    description: "Uncover the true costs of halal mortgages. From arrangement fees to early settlement charges, learn what Islamic home finance really costs in 2026.",
    href: "/blog/hidden-costs-of-islamic-mortgages-uk",
    tag: "UK Real Estate",
    readTime: "10 min read",
    date: "April 2026",
  },
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

            <div className="mt-auto pt-6 border-t border-slate-100">
              <AuthorSection />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
