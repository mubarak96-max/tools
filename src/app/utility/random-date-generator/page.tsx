import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("random-date-generator");

export default function Page() {
  return <ExactUtilityPage slug="random-date-generator" />;
}
