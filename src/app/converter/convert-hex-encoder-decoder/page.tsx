import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-hex-encoder-decoder");

export default function Page() {
  return <ExactConverterPage slug="convert-hex-encoder-decoder" />;
}
