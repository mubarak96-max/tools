import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("find-shortest-text-line");

export default function Page() {
  return <ExactTextToolPage slug="find-shortest-text-line" />;
}
