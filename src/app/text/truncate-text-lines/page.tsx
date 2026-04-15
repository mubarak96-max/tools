import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("truncate-text-lines");

export default function Page() {
  return <ExactTextToolPage slug="truncate-text-lines" />;
}
