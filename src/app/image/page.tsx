import CategoryHub from "@/components/hub/CategoryHub";
import { imageHub } from "@/lib/hubs/image";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: imageHub.metaTitle,
  description: imageHub.metaDescription,
  path: imageHub.path,
});

export default function ImagePage() {
  return <CategoryHub content={imageHub} />;
}
