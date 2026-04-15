import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("convert-spaces-to-tabs");

export default function Page() {
  return <ExactTextToolPage slug="convert-spaces-to-tabs" />;
}
