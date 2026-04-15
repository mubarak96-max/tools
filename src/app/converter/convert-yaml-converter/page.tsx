import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-yaml-converter");

export default function Page() {
  return <ExactConverterPage slug="convert-yaml-converter" />;
}
