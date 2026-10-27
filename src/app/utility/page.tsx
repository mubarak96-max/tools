import CategoryHub from "@/components/hub/CategoryHub";
import { utilityHub } from "@/lib/hubs/utility";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: utilityHub.metaTitle,
  description: utilityHub.metaDescription,
  path: utilityHub.path,
});

export default function UtilityPage() {
  return <CategoryHub content={utilityHub} />;
}
