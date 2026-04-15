import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-seconds-to-hms");

export default function Page() {
  return <ExactConverterPage slug="convert-seconds-to-hms" />;
}
