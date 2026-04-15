import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-utc-time-to-unix-time");

export default function Page() {
  return <ExactConverterPage slug="convert-utc-time-to-unix-time" />;
}
