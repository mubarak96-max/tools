import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-rot13-encoder-decoder");

export default function Page() {
  return <ExactConverterPage slug="convert-rot13-encoder-decoder" />;
}
