import CategoryHub from "@/components/hub/CategoryHub";
import { constructionHub } from "@/lib/hubs/construction";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: constructionHub.metaTitle,
  description: constructionHub.metaDescription,
  path: constructionHub.path,
});

export default function ConstructionPage() {
  return <CategoryHub content={constructionHub} />;
}
