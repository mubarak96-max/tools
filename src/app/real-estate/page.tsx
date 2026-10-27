import CategoryHub from "@/components/hub/CategoryHub";
import { realEstateHub } from "@/lib/hubs/real-estate";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: realEstateHub.metaTitle,
  description: realEstateHub.metaDescription,
  path: realEstateHub.path,
});

export default function RealEstatePage() {
  return <CategoryHub content={realEstateHub} />;
}
