import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Categories",
    links: [
      { name: "Text Tools", href: "/text" },
      { name: "Image Tools", href: "/image" },
      { name: "Real Estate", href: "/real-estate" },
      { name: "Health Tools", href: "/health" },
      { name: "Utility Tools", href: "/utility" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto relative border-t border-border/40 bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Subtle Gradient Accent */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-64 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.05)_0,rgba(255,255,255,0)_70%)]" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-6 lg:gap-8">
          {/* Logo & Branding */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/logo.svg"
                alt="FindBest Tools"
                width={160}
                height={36}
                className="h-8 w-auto opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-500">
              High-performance, private, browser-native tools built for speed. No sign-up, no server uploads, just purely functional utilities.
            </p>
          </div>

          {/* Nav Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {column.heading}
                </h3>
                <ul className="mt-6 space-y-4">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors hover:text-primary"
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

        {/* Support CTA Block */}
        <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-primary/10 bg-primary/[0.02] p-8 sm:p-10">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Can't find a specific tool?
              </h2>
              <p className="mt-2 text-slate-500">
                Let us know what workflow you're trying to optimize. We're constantly expanding our suite of browser-based utilities.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-100"
            >
              Request a Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 items-center border-t border-slate-100 pt-8 sm:flex sm:justify-between">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} FindBest Tools. All rights reserved. Built for speed and privacy.
          </p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            {["Privacy", "Terms", "Sitemap", "Contact"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
