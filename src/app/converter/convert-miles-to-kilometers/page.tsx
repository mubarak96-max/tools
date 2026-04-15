import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-miles-to-kilometers");

export default function Page() {
  return <ExactConverterPage slug="convert-miles-to-kilometers" />;
}
