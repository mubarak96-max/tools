import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("css-minifier");

export default function Page() {
  return <ExactUtilityPage slug="css-minifier" />;
}
