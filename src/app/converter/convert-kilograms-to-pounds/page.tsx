import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-kilograms-to-pounds");

export default function Page() {
  return <ExactConverterPage slug="convert-kilograms-to-pounds" />;
}
