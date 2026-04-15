import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-rgb-to-cmyk");

export default function Page() {
  return <ExactConverterPage slug="convert-rgb-to-cmyk" />;
}
