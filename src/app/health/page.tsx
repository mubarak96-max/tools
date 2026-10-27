import CategoryHub from "@/components/hub/CategoryHub";
import { healthHub } from "@/lib/hubs/health";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: healthHub.metaTitle,
  description: healthHub.metaDescription,
  path: healthHub.path,
});

export default function HealthPage() {
  return <CategoryHub content={healthHub} />;
}
