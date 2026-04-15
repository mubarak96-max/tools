import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-binary-encoder-decoder");

export default function Page() {
  return <ExactConverterPage slug="convert-binary-encoder-decoder" />;
}
