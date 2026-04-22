import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Image Tools for Background Removal and Base64 Conversion",
  description:
    "Use image tools for quick background removal and converting images to Base64 data strings directly in your browser.",
  path: "/image",
});

const IMAGE_TOOLS = [
  {
    name: "AI Background Remover",
    href: "/image/free-image-background-remover-online",
    description: "Remove the background from any photo instantly using local WebAssembly AI.",
    icon: "AI",
  },
  {
    name: "Convert Image to Base64",
    href: "/image/convert-image-to-base64",
    description: "Convert any image into a Base64 string or data URL directly in your browser.",
    icon: "B64",
  },
  {
    name: "Instagram Photo Resizer",
    href: "/image/resize-photo-instagram-online",
    description: "Resize any photo for Instagram Square, Portrait, Story, or Profile formats. No crop support.",
    icon: "IG",
  },
];

function ToolCard({ tool }: { tool: (typeof IMAGE_TOOLS)[number] }) {
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

export default function ImagePage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">Image Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Image - {IMAGE_TOOLS.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Image tools for background removal and asset processing.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Standalone image utilities for AI background removal and converting images to Base64 strings for web development.
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Image Tools
            <span className="ml-2 text-sm font-normal text-muted-foreground">({IMAGE_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {IMAGE_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Text Tools", href: "/text" },
            { label: "Health Tools", href: "/health" },
            { label: "Real Estate Tools", href: "/real-estate" },
            { label: "Utility Tools", href: "/utility" },
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
