import CategoryHub from "@/components/hub/CategoryHub";
import { marketingHub } from "@/lib/hubs/marketing";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: marketingHub.metaTitle,
  description: marketingHub.metaDescription,
  path: marketingHub.path,
});

export default function MarketingPage() {
  return <CategoryHub content={marketingHub} />;
}
