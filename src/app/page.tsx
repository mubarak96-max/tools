import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HomeToolSearch from "./HomeToolSearch";
import ToolGrid from "@/components/home/ToolGrid";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { ALL_TOOLS } from "@/lib/tools-data";

export const revalidate = 1800;

const HOME_TITLE = "Free Professional Online Utilities";
const HOME_DESCRIPTION =
  "Access 100+  tools for finance, text, images, and SEO. No account, no uploads—everything runs privately on your device.";

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
};

export default function Home() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]);

  return (
    <div className="relative min-h-screen bg-white font-sans">
      <JsonLd data={serializeJsonLd(breadcrumbJsonLd)} />

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-4">
            <h1 className="text-[40px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
              Professional tools.<br />
              <span className="text-primary">Free forever.</span>
            </h1>
            <p className="text-[15px] leading-[1.75] text-secondary max-w-[400px]">
              100+ tools for finance, text, seo, images, and more.
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
