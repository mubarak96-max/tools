import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("regex-match-extractor");

export default function Page() {
  return <ExactTextToolPage slug="regex-match-extractor" />;
}
