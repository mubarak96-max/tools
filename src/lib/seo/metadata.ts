import type { Metadata } from "next";
import type { CategoryAudienceHubData, CategoryHubData, UseCaseHubData } from "@/lib/discovery/hubs";
import { comparisonSlug } from "@/lib/slug";
import { compactText } from "@/lib/text";
import type { CustomPage, Tool } from "@/types/database";

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

function clampDescription(value: string, fallback: string) {
  const normalized = compactText(value || fallback);
  return normalized.length <= 160 ? normalized : `${normalized.slice(0, 157).trimEnd()}...`;
}

export function buildToolPageMetadata(tool: Tool): Metadata {
  const primaryUseCase = tool.useCases[0];
  const primaryPlatform = tool.platforms[0];
  const titleParts = [
    tool.name,
    tool.category,
    tool.pricingRange || tool.pricing,
    primaryPlatform ? `${primaryPlatform} Review` : "Review",
  ].filter(Boolean);

  return buildMetadata({
    title: titleParts.join(" | "),
    description: clampDescription(
      `${tool.shortDescription} ${primaryUseCase ? `Best for ${primaryUseCase.toLowerCase()}.` : ""} ${tool.bestFor ? `Built for ${tool.bestFor.toLowerCase()}.` : ""}`,
      tool.shortDescription,
    ),
    path: `/tools/${tool.slug}`,
  });
}

export function buildAlternativesPageMetadata(tool: Tool, count = 0): Metadata {
  const qualifier = tool.useCases[0] || tool.audiences[0] || tool.category.toLowerCase();

  return buildMetadata({
    title: `${tool.name} Alternatives for ${qualifier}`,
    description: clampDescription(
      `Compare ${count > 0 ? count : "top"} alternatives to ${tool.name} across pricing, setup, audience fit, and overlapping use cases.`,
      `Compare alternatives to ${tool.name}.`,
    ),
    path: `/alternatives-to-${tool.slug}`,
  });
}

export function buildComparisonPageMetadata(left: Tool, right: Tool): Metadata {
  const sharedAngle = left.useCases.find((useCase) =>
    right.useCases.some((candidate) => candidate.toLowerCase() === useCase.toLowerCase()),
  );

  return buildMetadata({
    title: `${left.name} vs ${right.name} for ${sharedAngle || left.category}`,
    description: clampDescription(
      `Head-to-head comparison of ${left.name} and ${right.name} on pricing, platform coverage, setup difficulty, and team fit.`,
      `Compare ${left.name} and ${right.name}.`,
    ),
    path: `/compare/${comparisonSlug(left.slug, right.slug)}`,
  });
}

export function buildCategoryHubMetadata(hub: CategoryHubData): Metadata {
  return buildMetadata({
    title: `${hub.categoryLabel} Tools by Fit, Price, and Audience`,
    description: clampDescription(
      `${hub.tools.length} published ${hub.categoryLabel.toLowerCase()} tools with audience slices, use-case hubs, and comparison routes.`,
      hub.categoryDescription,
    ),
    path: `/best/${hub.categorySlug}`,
  });
}

export function buildCategoryAudienceHubMetadata(hub: CategoryAudienceHubData): Metadata {
  return buildMetadata({
    title: `${hub.categoryLabel} Tools for ${hub.audienceLabel}`,
    description: clampDescription(
      `${hub.tools.length} ${hub.categoryLabel.toLowerCase()} tools matched to ${hub.audienceLabel.toLowerCase()} teams, with focused comparisons and workflow links.`,
      `Find ${hub.categoryLabel.toLowerCase()} tools for ${hub.audienceLabel.toLowerCase()}.`,
    ),
    path: `/best/${hub.categorySlug}/for/${hub.audienceSlug}`,
  });
}

export function buildUseCaseHubMetadata(hub: UseCaseHubData): Metadata {
  return buildMetadata({
    title: `Best Tools for ${hub.useCaseLabel} by Workflow`,
    description: clampDescription(
      `${hub.tools.length} tools for ${hub.useCaseLabel.toLowerCase()}, grouped by category, audience fit, and comparison path.`,
      hub.description,
    ),
    path: `/tools-for-${hub.useCaseSlug}`,
  });
}

export function buildEditorialPageMetadata(page: CustomPage, toolCount = 0): Metadata {
  const suffix = toolCount > 0 ? `${toolCount} linked tools` : "editorial guide";

  return buildMetadata({
    title: `${page.title} | ${suffix}`,
    description: clampDescription(page.metaDescription, page.title),
    path: `/p/${page.slug}`,
  });
}
