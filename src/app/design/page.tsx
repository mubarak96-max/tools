import CategoryHub from "@/components/hub/CategoryHub";
import { designHub } from "@/lib/hubs/design";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: designHub.metaTitle,
  description: designHub.metaDescription,
  path: designHub.path,
});

export default function DesignPage() {
  return <CategoryHub content={designHub} />;
}
