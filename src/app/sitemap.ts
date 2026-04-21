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
  { path: "/image", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/health", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/real-estate", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/utility", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.5 },
  { path: "/blog/binary-code-in-cybersecurity", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/binary-code-translation-for-developers", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/how-to-convert-text-to-binary", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/blog/understanding-binary-code", changeFrequency: "monthly" as const, priority: 0.5 },
];

const TOOL_PATHS = [
  "/health/bmr-calculator",
  "/image/ai-background-remover",
  "/image/convert-image-to-base64",
  "/real-estate/nyc-transfer-tax-calculator",
  "/text/binary-code-translator",
  "/text/convert-image-to-text",
  "/text/morse-code-translator",
  "/text/readability-flesch-kincaid-calculator",
  "/text/word-frequency",
  "/utility/barcode-generator",
  "/utility/barcode-scanner",
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
