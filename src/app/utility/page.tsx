import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Utility Tools for CV Building, QR Codes, and Barcodes",
  description: "Use utility tools for building resumes, generating QR codes and barcodes, and scanning codes with your camera.",
  path: "/utility",
});

const UTILITY_TOOLS = [
  {
    name: "Free CV Resume Builder",
    href: "/utility/free-cv-resume-builder",
    description: "Build a resume online for free with editable sections, multiple templates, browser autosave, and print-to-PDF export.",
    icon: "CV",
  },
  {
    name: "QR Code Generator",
    href: "/utility/qr-code-generator",
    description: "Create and download static QR codes with custom colors and zero expiry limits.",
    icon: "QR",
  },
  {
    name: "Barcode Generator",
    href: "/utility/barcode-generator",
    description: "Instantly create CODE128, UPC, and EAN barcodes and download high-quality PNGs.",
    icon: "CODE",
  },
  {
    name: "QR Code Scanner",
    href: "/utility/qr-code-scanner",
    description: "Scan QR codes using your device camera or upload an image to decode web links instantly.",
    icon: "CAM",
  },
  {
    name: "Barcode Scanner",
    href: "/utility/barcode-scanner",
    description: "Use your webcam or phone to scan 1D retail product barcodes and look them up online.",
    icon: "SCAN",
  },
];

function ToolCard({ tool }: { tool: (typeof UTILITY_TOOLS)[number] }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {tool.name}
        </h2>
        <div className="shrink-0 rounded-lg border border-border bg-muted p-2">
          <span className="text-[10px] font-black text-primary">{tool.icon}</span>
        </div>
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open tool -&gt;
      </span>
    </Link>
  );
}

export default function UtilityPage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">Utility Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Utility - {UTILITY_TOOLS.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Utility tools for productivity and specialized data.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Focused utilities for building professional CVs, generating codes, and scanning codes in your browser.
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Utility Tools
            <span className="ml-2 text-sm font-normal text-muted-foreground">({UTILITY_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {UTILITY_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Text Tools", href: "/text" },
            { label: "Image Tools", href: "/image" },
            { label: "Health Tools", href: "/health" },
            { label: "Real Estate Tools", href: "/real-estate" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
