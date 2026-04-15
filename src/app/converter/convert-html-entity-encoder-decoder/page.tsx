import { ExactConverterPage, buildExactConverterMetadata } from "@/lib/tool-pages/exactConverterPages";

export const revalidate = 43200;
export const metadata = buildExactConverterMetadata("convert-html-entity-encoder-decoder");

export default function Page() {
  return <ExactConverterPage slug="convert-html-entity-encoder-decoder" />;
}
