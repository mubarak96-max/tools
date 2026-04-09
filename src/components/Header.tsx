'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NAV_GROUPS = [
  {
    label: 'Text',
    href: '/text',
    tools: [
      { name: 'Character Counter', href: '/text/character-counter' },
      { name: 'Case Converter', href: '/text/case-converter' },
      { name: 'Word Frequency', href: '/text/word-frequency' },
      { name: 'Reverse Text', href: '/text/reverse-text-generator' },
      { name: 'Morse Code', href: '/text/morse-code-translator' },
      { name: 'ASCII Art', href: '/text/ascii-art-generator' },
    ],
  },
  {
    label: 'Image',
    href: '/image',
    tools: [
      { name: 'Flip Image', href: '/image/flip-image-online' },
      { name: 'Image to Base64', href: '/image/convert-image-to-base64' },
      { name: 'Image to Text (OCR)', href: '/text/convert-image-to-text' },
    ],
  },
  {
    label: 'PDF',
    href: '/pdf',
    tools: [
      { name: 'Merge PDF', href: '/pdf/merge-pdf' },
    ],
  },
  {
    label: 'Finance',
    href: '/finance',
    tools: [
      { name: 'Salary Calculator', href: '/finance/salary-calculator' },
      { name: 'UAE Salary', href: '/finance/uae-salary-calculator' },
      { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'EMI Calculator', href: '/finance/emi-calculator' },
      { name: 'VAT Calculator', href: '/finance/vat-calculator' },
      { name: 'Discount Calculator', href: '/finance/discount-calculator' },
    ],
  },
  {
    label: 'AI',
    href: '/ai',
    tools: [
      { name: 'AI Humanizer', href: '/ai/ai-humanizer' },
    ],
  },
  {
    label: 'Tailwind',
    href: '/tailwind',
    tools: [],
  },
  {
    label: 'Converter',
    href: '/converter',
    tools: [],
  },
  {
    label: 'Utility',
    href: '/utility',
    tools: [],
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-card/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

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
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${dropdownOpen ? 'text-primary bg-muted' : 'text-slate-700'}`}
            >
              All Tools
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-[calc(100%+0.5rem)] w-[700px] rounded-[1.25rem] border border-border bg-card p-5 shadow-[0_24px_56px_-28px_rgba(15,23,42,0.22)]">
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                      <Link
                        href={group.href}
                        className="block text-[11px] font-bold uppercase tracking-[0.14em] text-primary hover:underline mb-2"
                      >
                        {group.label}
                      </Link>
                      {group.tools.length > 0 ? (
                        <ul className="space-y-1.5">
                          {group.tools.map((tool) => (
                            <li key={tool.href}>
                              <Link
                                href={tool.href}
                                className="block text-[13px] text-slate-600 hover:text-primary transition-colors leading-snug"
                              >
                                {tool.name}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              href={group.href}
                              className="block text-[12px] font-medium text-muted-foreground hover:text-primary mt-0.5"
                            >
                              More →
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
            { label: 'Finance', href: '/finance' },
            { label: 'Text', href: '/text' },
            { label: 'AI', href: '/ai' },

          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${isActive(item.href) ? 'text-primary font-semibold' : 'text-slate-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-slate-700 transition-colors hover:border-primary/20 hover:text-primary"
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
                          className="text-[13px] text-slate-600 hover:text-primary transition-colors"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="border-t border-border/60 pt-4">
              <p className="text-xs text-muted-foreground">Browser-based · No uploads · Free forever</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

