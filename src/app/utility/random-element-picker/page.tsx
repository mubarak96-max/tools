import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("random-element-picker");

export default function Page() {
  return <ExactUtilityPage slug="random-element-picker" />;
}
