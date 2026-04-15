import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("js-prettifier");

export default function Page() {
  return <ExactUtilityPage slug="js-prettifier" />;
}
