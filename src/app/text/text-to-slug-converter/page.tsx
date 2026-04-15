import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("text-to-slug-converter");

export default function Page() {
  return <ExactTextToolPage slug="text-to-slug-converter" />;
}
