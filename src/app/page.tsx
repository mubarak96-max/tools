import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HomeToolSearch from "./HomeToolSearch";
import ToolGrid from "@/components/home/ToolGrid";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata, SITE_NAME } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { ALL_TOOLS } from "@/lib/tools-data";

export const revalidate = 1800;

const HOME_TITLE = "FindBest Tools: Free Calculators for Tax, Property, Text & SEO";
const HOME_DESCRIPTION =
  "110+ free calculators and tools for salary and tax, stamp duty, loans, text editing, SEO and social media. Formulas explained, most tools run in your browser, and none need an account.";

const AUTHOR_URL = "https://www.linkedin.com/in/mubarak-mutesa-43a21095/";

const baseMetadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    absolute: HOME_TITLE,
  },
};

export default function Home() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/favicon.svg"),
    founder: {
      "@type": "Person",
      name: "Mubarak Mutesasira",
      url: absoluteUrl("/about"),
      sameAs: [AUTHOR_URL],
    },
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: HOME_DESCRIPTION,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
  };

  return (
    <div className="relative min-h-screen bg-white font-sans">
      <JsonLd data={serializeJsonLd([organizationJsonLd, websiteJsonLd, breadcrumbJsonLd])} />

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-4">
            <h1 className="text-[40px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
              Free calculators and tools<br />
              <span className="text-primary">that show their working.</span>
            </h1>
            <p className="text-[15px] leading-[1.75] text-secondary max-w-[440px]">
              Work out take-home pay, stamp duty, loan costs and seller margins, or clean up text, check SEO snippets and resize images. Calculators explain the formula behind each result, and most tools run entirely in your browser.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/sitemap"
                className="bg-primary text-white text-[13px] font-medium px-[22px] py-[10px] rounded-[8px] hover:bg-primary-hover transition-colors"
              >
                Browse all tools
              </Link>
            </div>
            <div className="pt-4">
              <HomeToolSearch />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/image/free-image-background-remover-online"
              className="stripe-mini-card col-span-2 bg-primary-soft border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-primary mb-2">Most popular</div>
              <div className="text-[13px] font-semibold text-foreground">AI Background Remover</div>
              <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">Remove image backgrounds instantly using on-device AI.</div>
            </Link>
            <Link
              href="/utility/create-qr-code-online"
              className="stripe-mini-card hover:border-border-hover transition-colors"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-2">Utility</div>
              <div className="text-[13px] font-semibold text-foreground">QR Code Generator</div>
              <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">Custom colors, no expiry.</div>
            </Link>
            <Link
              href="/finance/etsy-profit-calculator"
              className="stripe-mini-card hover:border-border-hover transition-colors"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-2">Finance</div>
              <div className="text-[13px] font-semibold text-foreground">Etsy Profit Calculator</div>
              <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">Model fees and net margins.</div>
            </Link>
            <Link
              href="/seo/keyword-clustering"
              className="stripe-mini-card hover:border-border-hover transition-colors"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-2">SEO</div>
              <div className="text-[13px] font-semibold text-foreground">Keyword Clustering</div>
              <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">Group keywords by topic.</div>
            </Link>
            <Link
              href="/text/readability-flesch-kincaid-calculator"
              className="stripe-mini-card hover:border-border-hover transition-colors"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-2">Text</div>
              <div className="text-[13px] font-semibold text-foreground">Readability Calculator</div>
              <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">Flesch-Kincaid scoring.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <div className="section-label">Browse by category</div>
        <ToolGrid tools={ALL_TOOLS} />
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">How FindBest Tools are built</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Formulas you can check</h3>
            <p className="mt-2 text-[14px] leading-[1.7] text-secondary">
              Tax, loan and property calculators use published government rates and show the steps behind each result, so you can check them against a payslip, contract or statement.
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Private by default</h3>
            <p className="mt-2 text-[14px] leading-[1.7] text-secondary">
              Calculators, text tools, OCR and background removal run on your device. The few tools that need a server, such as DNS lookup and the AI humanizer, say so on the page.
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Independent and maintained</h3>
            <p className="mt-2 text-[14px] leading-[1.7] text-secondary">
              Built and maintained by{" "}
              <Link href="/about" className="font-medium text-primary hover:underline">Mubarak Mutesasira</Link>.
              Tools are re-checked when budgets or platform rules change, and you can{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">report an error</Link> on any page.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-muted border border-border rounded-[16px] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="text-[15px] font-semibold text-foreground mb-1">Can&apos;t find what you need?</h3>
            <p className="text-[13px] text-secondary">We&apos;re constantly expanding. Let us know what tool would help you.</p>
          </div>
          <Link
            href="/contact"
            className="bg-foreground text-white text-[13px] font-medium px-[22px] py-[10px] rounded-[8px] whitespace-nowrap shrink-0 hover:bg-black transition-colors"
          >
            Request a tool →
          </Link>
        </div>
      </section>
    </div>
  );
}
