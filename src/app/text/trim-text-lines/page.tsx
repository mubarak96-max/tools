import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("trim-text-lines");

export default function Page() {
  return <ExactTextToolPage slug="trim-text-lines" />;
}
