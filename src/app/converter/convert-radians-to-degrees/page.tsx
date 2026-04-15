import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-radians-to-degrees");

export default function Page() {
  return <ExactConverterPage slug="convert-radians-to-degrees" />;
}
