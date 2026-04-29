import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HomeToolSearch from "./HomeToolSearch";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 1800;

const HOME_TITLE = "Free Professional Online utilities";
const HOME_DESCRIPTION =
  "Access premium browser-based tools for text, images, and daily tasks. No sign-up, privacy-conscious design, and high-performance results.";

const baseMetadata = buildMetadata({
  title: "Free Professional Online Tools",
  description: HOME_DESCRIPTION,
  path: "/",
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    absolute: HOME_TITLE,
  },
  keywords: [
    "free online tools",
    "professional utilities",
    "no sign-up tools",
    "text analysis online",
    "image background removal",
    "cv builder free",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absoluteUrl("/"),
    type: "website",
  },
};

type HomeToolMeta = {
  name: string;
  href: string;
  description: string;
  category: string;
};

const FEATURED_TOOLS: HomeToolMeta[] = [
  {
    name: "Expected Goals (xG) Calculator",
    href: "/utility/xg-expected-goals-calculator",
    description: "Interactive xG calculator for football: pitch heatmap and shot parameters for expected goals modelling.",
    category: "Utility",
  },
  {
    name: "Free CV Resume Builder",
    href: "/utility/free-cv-resume-builder",
    description: "Build a resume online for free with editable sections, multiple templates, browser autosave, and print-to-PDF export.",
    category: "Utility",
  },
  {
    name: "AI Background Remover",
    href: "/image/free-image-background-remover-online",
    description: "Remove the background from any photo instantly using local WebAssembly AI.",
    category: "Image",
  },
  {
    name: "Word Frequency Counter",
    href: "/text/word-frequency",
    description: "Analyze repeated words, filter stop words, and surface the most-used terms in any text block.",
    category: "Text",
  },
  {
    name: "Image to Text OCR",
    href: "/text/convert-image-to-text",
    description: "Extract, clean, copy, and download editable text from JPG, PNG, WEBP, and BMP images with OCR.",
    category: "Text",
  },
  {
    name: "QR Code Generator",
    href: "/utility/qr-code-generator",
    description: "Create and download static QR codes with custom colors and zero expiry limits.",
    category: "Utility",
  },
  {
    name: "Readability / Flesch-Kincaid Calculator",
    href: "/text/readability-flesch-kincaid-calculator",
    description: "Score pasted text for reading ease, grade level, and sentence complexity.",
    category: "Text",
  },
  {
    name: "BMR Calculator",
    href: "/health/bmr-calculator",
    description: "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor Equation.",
    category: "Health",
  },
  {
    name: "NYC Transfer Tax Calculator",
    href: "/real-estate/nyc-transfer-tax-calculator",
    description: "Estimate New York City real property transfer tax from the transfer price and property type.",
    category: "Real Estate",
  },
  {
    name: "Morse Code Translator",
    href: "/text/morse-code-translator",
    description: "Translate text to Morse code and Morse code back to text with support for letters, numbers, and punctuation.",
    category: "Text",
  },
  {
    name: "Binary Code Translator",
    href: "/text/binary-code-translator",
    description: "Translate text to binary and binary back to text with 8-bit byte conversion and validation.",
    category: "Text",
  },
  {
    name: "Halal Mortgage Calculator",
    href: "/finance/halal-mortgage-calculator",
    description: "Compare Sharia-compliant home finance: Musharakah, Murabaha, and Ijara structures without interest.",
    category: "Finance",
  },
  {
    name: "Amazon FBA Calculator UK",
    href: "/finance/amazon-fba-calculator-uk",
    description: "Accurately model Amazon UK seller fees, referral costs, FBA fulfilment, and net profit.",
    category: "Finance",
  },
  {
    name: "Amazon FBA Canada Calculator",
    href: "/finance/amazon-fba-canada-calculator",
    description: "Calculate Amazon.ca fees in CAD: referral, fulfillment, and storage.",
    category: "Finance",
  },
  {
    name: "Etsy Profit Calculator",
    href: "/finance/etsy-profit-calculator",
    description: "Accurately model Etsy transaction fees, payment processing, ads, and net margins for handmade sellers.",
    category: "Finance",
  },
  {
    name: "US Take-Home Calculator",
    href: "/finance/us-take-home-pay-calculator",
    description: "Calculate 2026 US net pay after federal/state tax and benefits.",
    category: "Finance",
  },
  {
    name: "US Self-Employment Tax Calculator",
    href: "/finance/us-self-employment-tax-calculator",
    description: "Calculate IRS self-employment tax for 2026. Social Security, Medicare, and deductions for freelancers.",
    category: "Finance",
  },
  {
    name: "Australia Stamp Duty Calculator",
    href: "/finance/australia-stamp-duty-calculator",
    description: "Calculate property transfer duty across all 8 states. FHB concessions, foreign surcharges, and mortgage fees.",
    category: "Finance",
  },
  {
    name: "Australia GST Calculator",
    href: "/finance/australia-gst-calculator",
    description: "Add or remove 10% GST from any amount. Single amount or multi-item invoice mode with BAS reporting helper.",
    category: "Finance",
  },
  {
    name: "Canada HST/GST Calculator",
    href: "/finance/canada-hst-gst-calculator",
    description: "Calculate sales tax for all 13 Canadian provinces and territories. Add or reverse-calculate GST, HST, PST, and QST.",
    category: "Finance",
  },





  {
    name: "Inheritance Tax Calculator",
    href: "/finance/inheritance-tax-calculator",
    description: "Calculate inheritance tax, estate tax, and succession duty across 10 major global jurisdictions.",
    category: "Finance",
  },

  {
    name: "Salary After Tax Calculator",
    href: "/finance/salary-after-tax-calculator",
    description: "State-by-state 2026 take-home pay comparison and breakdown.",
    category: "Finance",
  },
  {
    name: "Bonus Tax Calculator",
    href: "/finance/bonus-tax-calculator",
    description: "Employee bonus tax withholding + business bonus depreciation tool.",
    category: "Finance",
  },
  {
    name: "Keyword Clustering Tool",
    href: "/seo/keyword-clustering",
    description: "Turn keyword lists into topic clusters with semantic NLP grouping.",
    category: "SEO",
  },
  {
    name: "Product Pricing Calculator",
    href: "/finance/product-pricing-calculator",
    description: "Calculate selling prices across Shopify, Etsy, and Amazon with real fees and margins.",
    category: "Finance",
  },
  {
    name: "YouTube Title Checker",
    href: "/seo/youtube-title-checker",
    description: "Analyze video titles for pixel width truncation, character limits, and SEO score with multi-device thumbnail previews.",
    category: "SEO",
  },
  {
    name: "Meta Description Checker",
    href: "/seo/meta-description-checker",
    description: "Measure title and meta description pixel width against Google limits. Real-time desktop and mobile SERP preview.",
    category: "SEO",
  },
  {
    name: "Hreflang Tag Generator",
    href: "/seo/hreflang-generator",
    description: "Generate and validate hreflang tags for multi-language SEO.",
    category: "SEO",
  },
  {
    name: "India SIP Calculator",
    href: "/finance/india-sip-calculator",
    description: "Mutual fund SIP returns with Step-Up SIP, Lumpsum, and SWP modes. Includes 2026 LTCG tax estimation.",
    category: "Finance",
  },
  {
    name: "India TDS Calculator",
    href: "/finance/india-tds-calculator",
    description: "Calculate TDS on salary, rent, professional fees, and more for FY 2026-26 with surcharge and cess.",
    category: "Finance",
  },
  {
    name: "Car Depreciation Calculator",
    href: "/finance/car-depreciation-calculator",
    description: "Accurate resale value and depreciation curves for 500+ makes and models.",
    category: "Finance",
  },
];

function ToolCard({ tool }: { tool: HomeToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col items-start gap-2.5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex w-full items-center justify-end">
        <span className="primary-chip rounded-full px-2.5 py-0.5 text-[9px] drop-shadow-sm">
          {tool.category}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors duration-150">
          {tool.name}
        </h3>
        <p className="text-[14px] leading-relaxed text-slate-500 line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-3 flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary opacity-0 -translate-x-2 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0">
          Launch Tool <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]);

  return (
    <div className="relative isolate min-h-screen">
      <JsonLd data={serializeJsonLd(breadcrumbJsonLd)} />

      {/* Hero Section */}
      <section className="relative overflow-visible pt-16 pb-12 lg:pt-24 lg:pb-16">
        {/* Background Mesh */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.05)_0,rgba(255,255,255,0)_100%)]" />
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(99,102,241,0.03)_0,rgba(255,255,255,0)_100%)]" />

        <div className="mx-auto max-w-7xl px-2 lg:px-4">
          <div className="mx-auto max-w-3xl text-center">


            <h1 className="hero-text text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-4xl animate-slide-up">
              Professional Free Tools,<br />Simply Built.
            </h1>



            <div className="relative z-20 mt-8 flex flex-col items-center gap-5 animate-fade-in [animation-delay:400ms]">
              <div className="w-full max-w-xl">
                <HomeToolSearch />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative bg-slate-50/80 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Most Used Tools</h2>

            </div>
            <Link
              href="/sitemap"
              className="secondary-button px-5 py-2 text-sm"
            >
              Explore Full Library
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {FEATURED_TOOLS.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer-ish spacer */}
      <div className="h-16 bg-gradient-to-b from-transparent to-[#F8FAFC]" />
    </div>
  );
}
