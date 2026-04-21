import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://findbest.tools";

export const revalidate = 14400;

const STATIC_PATHS = [
  { path: "/", changeFrequency: "daily" as const, priority: 1 },
  { path: "/sitemap", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/text", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/ai", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/construction", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/finance", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/image", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/health", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/real-estate", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/utility", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/design", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.5 },
  { path: "/blog/binary-code-in-cybersecurity", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/binary-code-translation-for-developers", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/carousel-caption-guide", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/free-carousel-maker-no-canva", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/how-to-convert-text-to-binary", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/how-to-make-a-carousel-go-viral", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/how-to-make-a-linkedin-carousel", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/instagram-carousel-size", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/understanding-binary-code", changeFrequency: "monthly" as const, priority: 0.5 },
];

const TOOL_PATHS = [
  "/ai/ai-humanizer",
  "/construction/concrete-volume-calculator",
  "/construction/flooring-material-calculator",
  "/construction/paint-coverage-calculator",
  "/construction/roofing-material-calculator",
  "/design/free-social-media-carousel-builder",
  "/finance/invoice-generator",
  "/health/bmr-calculator",
  "/health/calorie-calculator",
  "/image/free-image-background-remover-online",
  "/image/convert-image-to-base64",
  "/real-estate/nyc-transfer-tax-calculator",
  "/real-estate/price-per-square-foot-calculator",
  "/real-estate/uk-stamp-duty-calculator",
  "/real-estate/singapore-property-stamp-duty-calculator",
  "/real-estate/singapore-buyers-stamp-duty-calculator",
  "/real-estate/singapore-sellers-stamp-duty-calculator",
  "/real-estate/scotland-lbtt-calculator",
  "/real-estate/wales-ltt-calculator",
  "/real-estate/hong-kong-stamp-duty-calculator",
  "/text/binary-code-translator",
  "/text/case-converter",
  "/text/convert-image-to-text",
  "/text/duplicate-word-finder",
  "/text/morse-code-translator",
  "/text/readability-flesch-kincaid-calculator",
  "/text/word-cloud-generator",
  "/text/word-frequency",
  "/utility/barcode-generator",
  "/utility/barcode-scanner",
  "/utility/dns-checker",
  "/utility/free-cv-resume-builder",
  "/utility/qr-code-generator",
  "/utility/qr-code-scanner",
  "/utility/xg-expected-goals-calculator",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map((entry) => ({
      url: `${BASE_URL}${entry.path === "/" ? "" : entry.path}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...TOOL_PATHS.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path.startsWith("/text/") ? 0.9 : 0.8,
    })),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
