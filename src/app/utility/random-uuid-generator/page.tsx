import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("random-uuid-generator");

export default function Page() {
  return <ExactUtilityPage slug="random-uuid-generator" />;
}
