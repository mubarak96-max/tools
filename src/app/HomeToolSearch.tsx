"use client";

import Link from "next/link";
import { Command, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type HomeSearchTool = {
  name: string;
  href: string;
  description: string;
  category: string;
  icon: string;
};

const SEARCH_TOOLS: HomeSearchTool[] = [
  {
    name: "Expected Goals (xG) Calculator",
    href: "/utility/xg-expected-goals-calculator",
    description: "Interactive football xG calculator with pitch placement, shot factors, and match comparison.",
    category: "Utility",
    icon: "XG",
  },
  {
    name: "Free CV Resume Builder",
    href: "/utility/free-cv-resume-builder",
    description: "Build a resume online with editable sections, templates, autosave, and print export.",
    category: "Utility",
    icon: "CV",
  },
  {
    name: "AI Background Remover",
    href: "/image/free-image-background-remover-online",
    description: "Remove the background from photos using browser-based AI.",
    category: "Image",
    icon: "AI",
  },
  {
    name: "Word Frequency Counter",
    href: "/text/word-frequency",
    description: "Find repeated words and surface the most-used terms in any text.",
    category: "Text",
    icon: "FREQ",
  },
  {
    name: "Case Converter",
    href: "/text/case-converter",
    description: "Convert text between uppercase, lowercase, title case, sentence case, and developer formats.",
    category: "Text",
    icon: "CASE",
  },
  {
    name: "Word Cloud Generator",
    href: "/text/word-cloud-generator",
    description: "Create a visual word cloud from pasted text.",
    category: "Text",
    icon: "CLOUD",
  },
  {
    name: "Duplicate Word Finder",
    href: "/text/duplicate-word-finder",
    description: "Find repeated words and overused terms in any draft.",
    category: "Text",
    icon: "DUP",
  },
  {
    name: "AI Humanizer",
    href: "/ai/ai-humanizer",
    description: "Rewrite AI-like text into a more natural draft.",
    category: "AI",
    icon: "AI",
  },
  {
    name: "Invoice Generator",
    href: "/finance/invoice-generator",
    description: "Create printable invoices with line items, taxes, and totals.",
    category: "Finance",
    icon: "INV",
  },
  {
    name: "EMI Calculator",
    href: "/finance/emi-calculator",
    description: "Estimate monthly loan EMI, total interest, repayment, and affordability.",
    category: "Finance",
    icon: "EMI",
  },
  {
    name: "Break Even Point (BEP) Calculator",
    href: "/finance/break-even-calculator",
    description: "Calculate your break even point in units or revenue. Includes chart maker and goal modeling.",
    category: "Finance",
    icon: "BEP",
  },
  {
    name: "Amazon FBA Calculator UK",
    href: "/finance/amazon-fba-calculator-uk",
    description: "Accurately model Amazon UK seller fees, referral costs, FBA fulfilment, and net profit.",
    category: "Finance",
    icon: "FBA",
  },
  {
    name: "Etsy Profit Calculator",
    href: "/finance/etsy-profit-calculator",
    description: "Accurately model Etsy transaction fees, payment processing, ads, and net margins for handmade sellers.",
    category: "Finance",
    icon: "ETS",
  },
  {
    name: "Marketing ROI Calculator",
    href: "/marketing/marketing-roi-calculator",
    description: "Calculate ROAS, ROMI, CAC, and LTV. Compare performance across Google, Meta, and Email.",
    category: "Marketing",
    icon: "ROI",
  },
  {
    name: "Concrete Volume Calculator",
    href: "/construction/concrete-volume-calculator",
    description: "Estimate concrete volume for slabs, footings, columns, and holes.",
    category: "Construction",
    icon: "CON",
  },
  {
    name: "Flooring Material Calculator",
    href: "/construction/flooring-material-calculator",
    description: "Estimate flooring area, waste, boxes, and project cost.",
    category: "Construction",
    icon: "FLR",
  },
  {
    name: "Paint Coverage Calculator",
    href: "/construction/paint-coverage-calculator",
    description: "Estimate paint and primer coverage for rooms and projects.",
    category: "Construction",
    icon: "PNT",
  },
  {
    name: "Roofing Material Calculator",
    href: "/construction/roofing-material-calculator",
    description: "Estimate shingles, underlayment, nails, bundles, and waste.",
    category: "Construction",
    icon: "ROOF",
  },
  {
    name: "DNS Checker",
    href: "/utility/dns-checker",
    description: "Look up DNS records for any domain.",
    category: "Utility",
    icon: "DNS",
  },
  {
    name: "Calorie Calculator",
    href: "/health/calorie-calculator",
    description: "Estimate TDEE and daily calorie targets for your goal.",
    category: "Health",
    icon: "CAL",
  },
  {
    name: "Price per Square Foot Calculator",
    href: "/real-estate/price-per-square-foot-calculator",
    description: "Compare property sale or rent listings by price per area.",
    category: "Real Estate",
    icon: "SQFT",
  },
  {
    name: "UK Stamp Duty Calculator",
    href: "/real-estate/uk-stamp-duty-calculator",
    description: "Calculate SDLT for England and Northern Ireland purchases.",
    category: "Real Estate",
    icon: "UK",
  },
  {
    name: "Singapore Property Stamp Duty Calculator",
    href: "/real-estate/singapore-property-stamp-duty-calculator",
    description: "Estimate BSD, ABSD, and SSD for Singapore property.",
    category: "Real Estate",
    icon: "SG",
  },
  {
    name: "Singapore Buyer's Stamp Duty Calculator",
    href: "/real-estate/singapore-buyers-stamp-duty-calculator",
    description: "Calculate Singapore buyer stamp duty by residency and property count.",
    category: "Real Estate",
    icon: "BSD",
  },
  {
    name: "Singapore Seller's Stamp Duty Calculator",
    href: "/real-estate/singapore-sellers-stamp-duty-calculator",
    description: "Estimate Singapore seller stamp duty by holding period.",
    category: "Real Estate",
    icon: "SSD",
  },
  {
    name: "Scotland LBTT Calculator",
    href: "/real-estate/scotland-lbtt-calculator",
    description: "Calculate Scotland Land and Buildings Transaction Tax.",
    category: "Real Estate",
    icon: "LBTT",
  },
  {
    name: "Wales LTT Calculator",
    href: "/real-estate/wales-ltt-calculator",
    description: "Estimate Welsh Land Transaction Tax.",
    category: "Real Estate",
    icon: "LTT",
  },
  {
    name: "Hong Kong Stamp Duty Calculator",
    href: "/real-estate/hong-kong-stamp-duty-calculator",
    description: "Calculate Hong Kong ad valorem stamp duty.",
    category: "Real Estate",
    icon: "HK",
  },
  {
    name: "Image to Text OCR",
    href: "/text/convert-image-to-text",
    description: "Extract, clean, copy, and download editable text from images.",
    category: "Text",
    icon: "OCR",
  },
  {
    name: "QR Code Generator",
    href: "/utility/qr-code-generator",
    description: "Create and download static QR codes with custom colors.",
    category: "Utility",
    icon: "QR",
  },
  {
    name: "Readability / Flesch-Kincaid Calculator",
    href: "/text/readability-flesch-kincaid-calculator",
    description: "Score pasted text for reading ease, grade level, and sentence complexity.",
    category: "Text",
    icon: "READ",
  },
  {
    name: "BMR Calculator",
    href: "/health/bmr-calculator",
    description: "Calculate your basal metabolic rate with the Mifflin-St Jeor equation.",
    category: "Health",
    icon: "BMR",
  },
  {
    name: "NYC Transfer Tax Calculator",
    href: "/real-estate/nyc-transfer-tax-calculator",
    description: "Estimate NYC RPTT, NYS transfer tax, and mansion tax.",
    category: "Real Estate",
    icon: "NYC",
  },
  {
    name: "Morse Code Translator",
    href: "/text/morse-code-translator",
    description: "Translate text to Morse code and Morse code back to text.",
    category: "Text",
    icon: "MORSE",
  },
  {
    name: "Binary Code Translator",
    href: "/text/binary-code-translator",
    description: "Translate text to binary and binary back to text with byte validation.",
    category: "Text",
    icon: "BIN",
  },
  {
    name: "Convert Image to Base64",
    href: "/image/convert-image-to-base64",
    description: "Convert an image into a Base64 string or full data URL.",
    category: "Image",
    icon: "B64",
  },
  {
    name: "Instagram Photo Resizer",
    href: "/image/resize-photo-instagram-online",
    description: "Resize any photo for Instagram Square, Portrait, Story, or Profile formats.",
    category: "Image",
    icon: "IG",
  },
  {
    name: "Barcode Generator",
    href: "/utility/barcode-generator",
    description: "Create CODE128, UPC, and EAN barcodes and download PNGs.",
    category: "Utility",
    icon: "CODE",
  },
  {
    name: "QR Code Scanner",
    href: "/utility/qr-code-scanner",
    description: "Scan QR codes with your camera or uploaded image.",
    category: "Utility",
    icon: "CAM",
  },
  {
    name: "Barcode Scanner",
    href: "/utility/barcode-scanner",
    description: "Scan 1D barcodes with your camera or uploaded image.",
    category: "Utility",
    icon: "SCAN",
  },
];

export default function HomeToolSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popularSearches = ["resume", "background", "qr", "ocr", "text", "binary"];

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return SEARCH_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("home-tool-searches");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        window.requestAnimationFrame(() => {
          setRecentQueries(parsed.filter((item): item is string => typeof item === "string").slice(0, 4));
        });
      }
    } catch {
      // Keep search usable when local storage is unavailable.
    }
  }, []);

  function saveRecentQuery(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;
    const next = [normalized, ...recentQueries.filter((item) => item !== normalized)].slice(0, 4);
    setRecentQueries(next);
    try {
      window.localStorage.setItem("home-tool-searches", JSON.stringify(next));
    } catch {
      // Keep search usable when local storage is unavailable.
    }
  }

  function handleQuickSearch(value: string) {
    setQuery(value);
    setIsOpen(true);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="group relative mx-auto mt-6 w-full">
      <div className="group/input relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
          <Search className="h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within/input:text-primary" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full rounded-full border border-white/40 bg-white/60 py-5 pl-14 pr-24 text-lg text-slate-900 placeholder-slate-400 shadow-premium backdrop-blur-xl transition-all duration-300 focus:border-primary/20 focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary/5 sm:text-xl"
          placeholder="What do you need to do today?..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-6">
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/50 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-400 shadow-inner sm:flex">
              <Command className="h-3 w-3" />
              <span>/</span>
            </div>
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="absolute left-0 right-0 z-50 mt-4 max-h-[460px] overflow-y-auto rounded-[2.5rem] border border-white/40 bg-white/95 p-4 shadow-hover backdrop-blur-2xl animate-fade-in">
          {query.trim() ? (
            filteredTools.length > 0 ? (
              <div className="grid gap-1">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Search Results
                </p>
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-3 rounded-2xl p-3 transition-all hover:scale-[1.01] hover:bg-primary/5"
                    onClick={() => {
                      saveRecentQuery(query);
                      setIsOpen(false);
                    }}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white text-[10px] font-black text-primary shadow-sm ring-1 ring-black/5">
                      {tool.icon}
                    </span>
                    <span className="flex min-w-0 flex-col overflow-hidden">
                      <span className="truncate text-sm font-bold text-slate-900">{tool.name}</span>
                      <span className="truncate text-xs text-slate-500">{tool.description}</span>
                    </span>
                    <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                      {tool.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-[15px] font-semibold text-slate-900">No tools found</p>
                <p className="mt-1 text-sm text-slate-500">Try searching for &quot;cv&quot;, &quot;image&quot; or &quot;qr&quot;</p>
              </div>
            )
          ) : (
            <div className="space-y-8 p-2">
              <div>

                <div className="mt-1 flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleQuickSearch(item)}
                      className="rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary-soft hover:text-primary active:translate-y-0"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {recentQueries.length > 0 ? (
                <div>
                  <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Your Recent Searches
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recentQueries.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleQuickSearch(item)}
                        className="rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary-soft hover:text-primary active:translate-y-0"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
