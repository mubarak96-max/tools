import { ExactUtilityPage, buildExactUtilityMetadata } from "@/lib/tool-pages/exactUtilityPages";

export const revalidate = 43200;
export const metadata = buildExactUtilityMetadata("css-prettify");

export default function Page() {
  return <ExactUtilityPage slug="css-prettify" />;
}
