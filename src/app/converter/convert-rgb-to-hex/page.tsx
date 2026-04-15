import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-rgb-to-hex");

export default function Page() {
  return <ExactConverterPage slug="convert-rgb-to-hex" />;
}
