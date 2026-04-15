import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("upside-down-text-generator");

export default function Page() {
  return <ExactTextToolPage slug="upside-down-text-generator" />;
}
