import type { Metadata } from "next";

export const SITE_NAME = "findmytool";
export const SITE_DESCRIPTION =
  "Discover the best software tools with structured reviews, comparisons, and decision-ready editorial guidance.";

export function getBaseUrl() {
  return new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.yourdomain.com");
}

export function absoluteUrl(path = "/") {
  return new URL(path, getBaseUrl()).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
