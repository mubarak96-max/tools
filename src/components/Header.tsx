'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NAV_GROUPS = [
  {
    label: 'Design',
    href: '/design',
    tools: [
      { name: 'Social Media Carousel', href: '/design/free-social-media-carousel-builder', icon: 'CAR' },
    ],
  },
  {
    label: 'Text',
    href: '/text',
    tools: [
      { name: 'Word Frequency', href: '/text/word-frequency', icon: 'FREQ' },
      { name: 'Morse Code Translator', href: '/text/morse-code-translator', icon: 'MORSE' },
      { name: 'Binary Code Translator', href: '/text/binary-code-translator', icon: 'BIN' },
      { name: 'Image to Text (OCR)', href: '/text/convert-image-to-text', icon: 'OCR' },
      { name: 'Readability Calculator', href: '/text/readability-flesch-kincaid-calculator', icon: 'READ' },
    ],
  },
  {
    label: 'Image',
    href: '/image',
    tools: [
      { name: 'AI Background Remover', href: '/image/ai-background-remover', icon: 'AI' },
      { name: 'Image to Base64', href: '/image/convert-image-to-base64', icon: 'B64' },
    ],
  },
  {
    label: 'Health',
    href: '/health',
    tools: [
      { name: 'BMR Calculator', href: '/health/bmr-calculator', icon: 'BMR' },
    ],
  },
  {
    label: 'Real Estate',
    href: '/real-estate',
    tools: [
      { name: 'NYC Transfer Tax', href: '/real-estate/nyc-transfer-tax-calculator', icon: 'NYC' },
    ],
  },
  {
    label: 'Utility',
    href: '/utility',
    tools: [
      { name: 'Free CV Resume Builder', href: '/utility/free-cv-resume-builder', icon: 'CV' },
      { name: 'QR Code Generator', href: '/utility/qr-code-generator', icon: 'QR' },
      { name: 'Barcode Generator', href: '/utility/barcode-generator', icon: 'CODE' },
      { name: 'QR Code Scanner', href: '/utility/qr-code-scanner', icon: 'CAM' },
      { name: 'Barcode Scanner', href: '/utility/barcode-scanner', icon: 'SCAN' },
      { name: 'xG Calculator', href: '/utility/xg-expected-goals-calculator', icon: 'XG' },
    ],
  },
];

export default function Header() {
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const [dropdownOpenPath, setDropdownOpenPath] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const mobileOpen = mobileOpenPath === pathname;
  const dropdownOpen = dropdownOpenPath === pathname;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenPath(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.svg"
            alt="FindBest Tools"
            width={182}
            height={42}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">

          {/* Tools mega-dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpenPath(dropdownOpen ? null : pathname)}
              aria-expanded={dropdownOpen}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:bg-primary/5 ${dropdownOpen ? 'text-primary bg-primary/10' : 'text-slate-700'}`}
            >
              All Tools
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-4 w-[720px] origin-top-left animate-fade-in rounded-3xl border border-white/40 bg-white/95 p-8 shadow-premium backdrop-blur-2xl">
                <div className="grid grid-cols-4 gap-8">
                  {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                      <Link
                        href={group.href}
                        className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-primary/80"
                      >
                        {group.label}
                      </Link>
                      {group.tools.length > 0 ? (
                        <ul className="space-y-1.5">
                          {group.tools.map((tool) => (
                              <li key={tool.href}>
                                <Link
                                  href={tool.href}
                                  className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-primary transition-colors leading-snug"
                                >
                                  <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                    {tool.icon}
                                  </span>
                                  {tool.name}
                                </Link>
                              </li>
                          ))}
                          <li>
                            <Link
                              href={group.href}
                              className="inline-flex items-center text-xs font-semibold text-primary/60 hover:text-primary transition-colors mt-2"
                            >
                              Explore all
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </li>
                        </ul>
                      ) : (
                        <Link href={group.href} className="block text-[13px] text-slate-600 hover:text-primary transition-colors">
                          Browse {group.label} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="text-xs text-muted-foreground">Browser-based · No uploads · Free forever</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick links */}
          {[
            { label: 'Text', href: '/text' },
            { label: 'Image', href: '/image' },
            { label: 'Utility', href: '/utility' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all hover:bg-primary/5 ${isActive(item.href) ? 'text-primary bg-primary/5 shadow-inner' : 'text-slate-600 hover:text-primary'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/50 text-slate-700 shadow-sm backdrop-blur-md transition-all active:scale-95"
          onClick={() => setMobileOpenPath(mobileOpen ? null : pathname)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card px-4 pb-6 pt-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <Link
                  href={group.href}
                  className={`block text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5 ${isActive(group.href) ? 'text-primary' : 'text-slate-500'}`}
                >
                  {group.label}
                </Link>
                {group.tools.length > 0 && (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {group.tools.map((tool) => (
                        <li key={tool.href}>
                          <Link
                            href={tool.href}
                            className="flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-primary transition-colors"
                          >
                            <span className="shrink-0 rounded border border-border bg-muted px-1 text-[8px] font-bold text-primary">
                              {tool.icon}
                            </span>
                            {tool.name}
                          </Link>
                        </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

          </div>
        </div>
      )}
    </header>
  );
}
