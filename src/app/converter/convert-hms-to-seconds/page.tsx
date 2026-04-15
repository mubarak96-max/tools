import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-hms-to-seconds");

export default function Page() {
  return <ExactConverterPage slug="convert-hms-to-seconds" />;
}
