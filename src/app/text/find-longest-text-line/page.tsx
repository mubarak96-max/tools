import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("find-longest-text-line");

export default function Page() {
  return <ExactTextToolPage slug="find-longest-text-line" />;
}
