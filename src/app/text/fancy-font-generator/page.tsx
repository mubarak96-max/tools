import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("fancy-font-generator");

export default function Page() {
  return <ExactTextToolPage slug="fancy-font-generator" />;
}
