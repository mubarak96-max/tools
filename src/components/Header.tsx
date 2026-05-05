'use client';

import Link from 'next/link';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NAV_GROUPS = [
  {
    label: 'Design',
    href: '/design',
    tools: [
      { name: 'Social Media Carousel', href: '/design/free-social-media-carousel-builder'},
    ],
  },
  {
    label: 'Text',
    href: '/text',
    tools: [
      { name: 'Word Frequency', href: '/text/word-frequency'},
      { name: 'Case Converter', href: '/text/case-converter'},
      { name: 'Word Cloud Generator', href: '/text/word-cloud-generator'},
      { name: 'Duplicate Word Finder', href: '/text/duplicate-word-finder'},
      { name: 'Morse Code Translator', href: '/text/morse-code-translator'},
      { name: 'Binary Code Translator', href: '/text/binary-code-translator'},
      { name: 'Image to Text (OCR)', href: '/text/scan-text-from-image'},
      { name: 'Readability Calculator', href: '/text/readability-flesch-kincaid-calculator'},
    ],
  },
  {
    label: 'Image',
    href: '/image',
    tools: [
      { name: 'AI Background Remover', href: '/image/free-image-background-remover-online'},
      { name: 'Image to Base64', href: '/image/convert-image-to-base64'},
    ],
  },
  {
    label: 'AI',
    href: '/ai',
    tools: [
      { name: 'AI Humanizer', href: '/ai/ai-humanizer'},
    ],
  },
  {
    label: 'Finance',
    href: '/finance',
    tools: [
      { name: 'EMI Calculator', href: '/finance/emi-calculator'},
      { name: 'Invoice Generator', href: '/finance/invoice-generator'},
      { name: 'CPP & EI Calculator', href: '/finance/cpp-ei-calculator'},
      { name: 'UAE Gratuity', href: '/finance/uae-gratuity-calculator'},
      { name: 'UAE Visa Cost', href: '/finance/uae-visa-cost-calculator'},
    ],
  },
  {
    label: 'Construction',
    href: '/construction',
    tools: [
      { name: 'Concrete Volume', href: '/construction/concrete-volume-calculator'},
      { name: 'Paint Coverage', href: '/construction/paint-coverage-calculator'},
      { name: 'Flooring Materials', href: '/construction/flooring-material-calculator'},
      { name: 'Roofing Materials', href: '/construction/roofing-material-calculator'},
    ],
  },
  {
    label: 'Health',
    href: '/health',
    tools: [
      { name: 'BMR Calculator', href: '/health/bmr-calculator'},
      { name: 'Calorie Calculator', href: '/health/calorie-calculator'},
    ],
  },
  {
    label: 'Real Estate',
    href: '/real-estate',
    tools: [
      { name: 'NYC Transfer Tax', href: '/real-estate/nyc-transfer-tax-calculator'},
      { name: 'Price per Sq Ft', href: '/real-estate/price-per-square-foot-calculator'},
      { name: 'UK Stamp Duty', href: '/real-estate/uk-stamp-duty-calculator'},
      { name: 'Singapore Property Stamp Duty', href: '/real-estate/singapore-property-stamp-duty-calculator'},
      { name: 'Scotland LBTT', href: '/real-estate/scotland-lbtt-calculator'},
      { name: 'Wales LTT', href: '/real-estate/wales-ltt-calculator'},
      { name: 'Hong Kong Stamp Duty', href: '/real-estate/hong-kong-stamp-duty-calculator'},
    ],
  },
  {
    label: 'Utility',
    href: '/utility',
    tools: [
      { name: 'DNS Checker', href: '/utility/dns-checker'},
      { name: 'Free CV Resume Builder', href: '/utility/free-cv-resume-builder'},
      { name: 'QR Code Generator', href: '/utility/create-qr-code-online'},
      { name: 'Barcode Generator', href: '/utility/barcode-generator'},
      { name: 'QR Code Scanner', href: '/utility/qr-code-scanner'},
      { name: 'Barcode Scanner', href: '/utility/barcode-scanner'},
      { name: 'xG Calculator', href: '/utility/xg-expected-goals-calculator'},
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

  useEffect(() => {
    setMobileOpenPath(null);
    setDropdownOpenPath(null);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="text-[18px] font-semibold tracking-tight hover:opacity-80 transition-opacity">
          findbest<span className="text-primary">.</span>tools
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
           <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpenPath(dropdownOpen ? null : pathname)}
              className={`text-[13px] font-medium transition-colors flex items-center gap-1 ${dropdownOpen ? 'text-primary' : 'text-secondary hover:text-foreground'}`}
            >
              Tools
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[800px] animate-fade-in rounded-[24px] border border-border bg-white p-8 shadow-premium">
                <div className="grid grid-cols-4 gap-x-8 gap-y-10">
                  {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                        {group.label}
                      </div>
                      <ul className="space-y-2">
                        {group.tools.slice(0, 5).map((tool) => (
                          <li key={tool.href}>
                            <Link href={tool.href} className="text-[13px] text-secondary hover:text-primary transition-colors block">
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={group.href} className="text-[12px] font-semibold text-primary hover:opacity-80 transition-opacity inline-flex items-center gap-1 mt-1">
                            Explore all <ArrowRight className="h-3 w-3" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/blog" className="text-[13px] font-medium text-secondary hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-[13px] font-medium text-secondary hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="bg-foreground text-white text-[13px] font-medium px-[18px] py-[8px] rounded-[8px] hover:bg-black transition-colors"
          >
            Request a tool →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-secondary"
          onClick={() => setMobileOpenPath(mobileOpen ? null : pathname)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-8 animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="space-y-8">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <Link href={group.href} className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 block">
                  {group.label}
                </Link>
                <div className="grid grid-cols-1 gap-3">
                  {group.tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="text-[14px] text-secondary hover:text-primary">
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <Link href="/contact" className="block text-center bg-foreground text-white font-medium py-3 rounded-[8px]">
                Request a tool →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
