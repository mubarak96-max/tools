import CategoryHub from "@/components/hub/CategoryHub";
import { seoHub } from "@/lib/hubs/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: seoHub.metaTitle,
  description: seoHub.metaDescription,
  path: seoHub.path,
});

export default function SeoPage() {
  return <CategoryHub content={seoHub} />;
}
