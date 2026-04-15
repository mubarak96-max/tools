import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("json-prettifier");

export default function Page() {
  return <ExactUtilityPage slug="json-prettifier" />;
}
