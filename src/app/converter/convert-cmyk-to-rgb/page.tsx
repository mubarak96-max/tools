import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-cmyk-to-rgb");

export default function Page() {
  return <ExactConverterPage slug="convert-cmyk-to-rgb" />;
}
