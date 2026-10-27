import CategoryHub from "@/components/hub/CategoryHub";
import { financeHub } from "@/lib/hubs/finance";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: financeHub.metaTitle,
  description: financeHub.metaDescription,
  path: financeHub.path,
});

export default function FinancePage() {
  return <CategoryHub content={financeHub} />;
}
