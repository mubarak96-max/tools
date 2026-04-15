import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("tiny-text-generator");

export default function Page() {
  return <ExactTextToolPage slug="tiny-text-generator" />;
}
