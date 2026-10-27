import CategoryHub from "@/components/hub/CategoryHub";
import { textHub } from "@/lib/hubs/text";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: textHub.metaTitle,
  description: textHub.metaDescription,
  path: textHub.path,
});

export default function TextPage() {
  return <CategoryHub content={textHub} />;
}
