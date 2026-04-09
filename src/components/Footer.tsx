import Image from 'next/image';
import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    heading: 'Text Tools',
    href: '/text',
    links: [
      { name: 'Character Counter', href: '/text/character-counter' },
      { name: 'Case Converter', href: '/text/case-converter' },
      { name: 'Word Frequency', href: '/text/word-frequency' },
      { name: 'Reverse Text', href: '/text/reverse-text-generator' },
      { name: 'Morse Code', href: '/text/morse-code-translator' },
      { name: 'ASCII Art', href: '/text/ascii-art-generator' },
      { name: 'Word Cloud', href: '/text/word-cloud-generator' },
      { name: 'Image to Text (OCR)', href: '/text/convert-image-to-text' },
    ],
  },
  {
    heading: 'Image & PDF',
    href: '/image',
    links: [
      { name: 'Flip Image', href: '/image/flip-image-online' },
      { name: 'Image to Base64', href: '/image/convert-image-to-base64' },
      { name: 'Merge PDF', href: '/pdf/merge-pdf' },
      { name: 'All Image Tools', href: '/image' },
      { name: 'All PDF Tools', href: '/pdf' },
    ],
  },
  {
    heading: 'Finance',
    href: '/finance',
    links: [
      { name: 'Salary Calculator', href: '/finance/salary-calculator' },
      { name: 'UAE Salary', href: '/finance/uae-salary-calculator' },
      { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'EMI Calculator', href: '/finance/emi-calculator' },
      { name: 'VAT Calculator', href: '/finance/vat-calculator' },
      { name: 'Discount Calculator', href: '/finance/discount-calculator' },
      { name: 'Profit Margin', href: '/finance/profit-margin-calculator' },
      { name: 'Compound Interest', href: '/finance/compound-interest-calculator' },
    ],
  },
  {
    heading: 'More Tools',
    href: '/',
    links: [
      { name: 'AI Humanizer', href: '/ai/ai-humanizer' },
      { name: 'Tailwind Tools', href: '/tailwind' },
      { name: 'Converter Tools', href: '/converter' },
      { name: 'Utility Tools', href: '/utility' },
      { name: 'All Reviewed Tools', href: '/tools' },
    ],
  },
  {
    heading: 'Company',
    href: '/about',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Sitemap', href: '/sitemap' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Top section: logo + columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Image
              src="/images/logo.svg"
              alt="FindBest Tools"
              width={182}
              height={42}
              className="h-9 w-auto"
            />
            <p className="mt-4 text-sm leading-6 text-muted-foreground max-w-xs">
              Browser-based utility tools. No sign-up, no uploads — your files stay on your device.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>⚡ Fast</span>
              <span>·</span>
              <span>🔒 Private</span>
              <span>·</span>
              <span>🆓 Free</span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <Link
                href={col.href}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                {col.heading}
              </Link>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FindBest Tools. Browser-based utility tools — free, private, no sign-up.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/sitemap" className="hover:text-foreground transition-colors">Sitemap</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
