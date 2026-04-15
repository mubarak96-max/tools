import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-celsius-to-fahrenheit");

export default function Page() {
  return <ExactConverterPage slug="convert-celsius-to-fahrenheit" />;
}
