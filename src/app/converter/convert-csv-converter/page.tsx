import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-csv-converter");

export default function Page() {
  return <ExactConverterPage slug="convert-csv-converter" />;
}
