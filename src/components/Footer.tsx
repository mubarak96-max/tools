import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Categories",
    links: [
      { name: "Text", href: "/text" },
      { name: "Image", href: "/image" },
      { name: "PDF", href: "/pdf" },
      { name: "Finance", href: "/finance" },
      { name: "Real Estate", href: "/real-estate" },
      { name: "Health", href: "/health" },
      { name: "Tailwind", href: "/tailwind" },
      { name: "Converter", href: "/converter" },
      { name: "Utility", href: "/utility" },
      { name: "AI", href: "/ai" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Guides", href: "/guides" },
      { name: "API Docs", href: "/api" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms", href: "/terms" },

    ],
  },
];



export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Logo and description */}
        <div className="mb-10 flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="mb-4 inline-flex items-center">
              <Image
                src="/images/logo.svg"
                alt="FindBest Tools"
                width={182}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <p className="max-w-md text-center text-sm leading-6 text-muted-foreground lg:text-left">
              Browser-based tools for practical work across text, images, PDFs, finance, real
              estate, health, and lightweight AI workflows.
            </p>
          </div>

          {/* Newsletter signup */}
          <div className="flex flex-col items-center lg:items-start lg:ml-10">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Get Tool Updates</h3>
            <form className="flex gap-2 w-full max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-border bg-card py-3 pl-5 pr-5 text-sm text-foreground placeholder-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Get notified when we add new tools and features.
            </p>
          </div>
        </div>



        {/* Footer Columns */}
        <div className="grid gap-10 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">{column.heading}</h3>
              <ul className="space-y-2">
                {column.links.map((link, index) => {

                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 rounded-[1.75rem] border border-border/70 bg-card px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Can't find what you need?
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us what problem you are trying to solve and which workflow is missing.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Request a Tool
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-border/60 pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
