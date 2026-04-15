import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-fahrenheit-to-celsius");

export default function Page() {
  return <ExactConverterPage slug="convert-fahrenheit-to-celsius" />;
}
