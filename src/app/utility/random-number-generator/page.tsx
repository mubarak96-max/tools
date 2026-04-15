import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("random-number-generator");

export default function Page() {
  return <ExactUtilityPage slug="random-number-generator" />;
}
