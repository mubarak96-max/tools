import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Categories",
    links: [
      { name: "Finance", href: "/finance" },
      { name: "Text", href: "/text" },
      { name: "Image", href: "/image" },
      { name: "PDF", href: "/pdf" },
      { name: "Real Estate", href: "/real-estate" },
      { name: "Health", href: "/health" },
      { name: "Utility", href: "/utility" },
      { name: "Converter", href: "/converter" },
      { name: "Tailwind", href: "/tailwind" },
      { name: "AI", href: "/ai" },
    ],
  },
  {
    heading: "Popular Tools",
    links: [
      { name: "Salary Calculator", href: "/finance/salary-calculator" },
      { name: "Mortgage Calculator", href: "/finance/mortgage-calculator" },
      { name: "Merge PDF", href: "/pdf/merge-pdf" },
      { name: "Image Compressor", href: "/image/image-compressor" },
      { name: "Character Counter", href: "/text/character-counter" },
      { name: "AI Humanizer", href: "/ai/ai-humanizer" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
] as const;

const TRUST_ITEMS = [
  "Free to use",
  "No sign-up required",
  "Browser-based workflows",
  "Fast results",
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-border/70 bg-card px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                Need another tool?
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Cannot find what you need?
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Tell us what problem you are trying to solve and which workflow is missing.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Request a tool
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo.svg"
                alt="FindBest Tools"
                width={182}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Browser-based tools for practical work across text, images, PDFs, finance, real
              estate, health, and lightweight AI workflows.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {TRUST_ITEMS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-sm font-semibold text-foreground">{column.heading}</h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} FindBest Tools. Practical browser-based tools for
              quick results.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link href="/sitemap" className="transition-colors hover:text-foreground">
                Sitemap
              </Link>
              <Link href="/contact" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
