import { MetadataRoute } from 'next';
import { listComparisonSlugs } from "@/lib/db/comparisons";
import { listPages } from "@/lib/db/pages";
import { listTools } from "@/lib/db/tools";
import { listCategoryAudienceHubSlugs, listCategoryHubSlugs } from "@/lib/discovery/hubs";
import { slugify } from "@/lib/slug";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://findbest.tools';

export const revalidate = 14400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/text`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/ai/ai-humanizer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance/emi-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance/salary-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/finance/uae-salary-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance/discount-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/finance/vat-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance/profit-margin-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance/compound-interest-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/text/word-frequency`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/finance/mortgage-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/finance/car-loan-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const [tools, pages, categorySlugs, categoryAudiencePairs, comparisonSlugs] = await Promise.all([
    listTools({ status: ["published"] }),
    listPages({ status: ["published"] }),
    listCategoryHubSlugs(),
    listCategoryAudienceHubSlugs(),
    listComparisonSlugs(),
  ]);

  const useCaseSlugs = new Set<string>();

  tools.forEach((tool) => {
    const updated = tool.updatedAt ? new Date(tool.updatedAt) : new Date();

    sitemapEntries.push({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    sitemapEntries.push({
      url: `${BASE_URL}/alternatives-to-${tool.slug}`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    tool.useCases.forEach((useCase) => {
      const useCaseSlug = slugify(useCase);
      if (useCaseSlug) {
        useCaseSlugs.add(useCaseSlug);
      }
    });
  });

  useCaseSlugs.forEach((useCaseSlug) => {
    sitemapEntries.push({
      url: `${BASE_URL}/tools-for-${useCaseSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    });
  });

  categorySlugs.forEach((categorySlug) => {
    sitemapEntries.push({
      url: `${BASE_URL}/best/${categorySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  });

  categoryAudiencePairs.forEach(({ category, audience }) => {
    sitemapEntries.push({
      url: `${BASE_URL}/best/${category}/for/${audience}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  comparisonSlugs.forEach((slug) => {
    sitemapEntries.push({
      url: `${BASE_URL}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  pages.forEach((page) => {
    sitemapEntries.push({
      url: `${BASE_URL}/p/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  const seen = new Set<string>();

  return sitemapEntries.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }

    seen.add(entry.url);
    return true;
  });
}
