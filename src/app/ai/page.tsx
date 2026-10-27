import CategoryHub from "@/components/hub/CategoryHub";
import { aiHub } from "@/lib/hubs/ai";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: aiHub.metaTitle,
  description: aiHub.metaDescription,
  path: aiHub.path,
});

export default function AiPage() {
  return <CategoryHub content={aiHub} />;
}
