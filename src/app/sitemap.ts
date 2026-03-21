import { MetadataRoute } from 'next';
import { adminDb } from "@/lib/firebase-admin";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yourdomain.com';

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
  ];

  try {
    if (!adminDb) return sitemapEntries; // Fallback if no DB
    
    // Fetch all tools to build dynamic URLs
    const snapshot = await adminDb.collection('tools').get();
    
    snapshot.docs.forEach((doc) => {
      const slug = doc.id;
      const data = doc.data();
      const updated = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();

      // Tool Detail Page
      sitemapEntries.push({
        url: `${BASE_URL}/tools/${slug}`,
        lastModified: updated,
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // Alternative Page
      sitemapEntries.push({
        url: `${BASE_URL}/alternatives-to-${slug}`,
        lastModified: updated,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return sitemapEntries;
}
