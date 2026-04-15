import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-unix-time-to-utc-time");

export default function Page() {
  return <ExactConverterPage slug="convert-unix-time-to-utc-time" />;
}
