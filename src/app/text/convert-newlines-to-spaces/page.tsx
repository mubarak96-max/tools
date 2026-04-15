import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("convert-newlines-to-spaces");

export default function Page() {
  return <ExactTextToolPage slug="convert-newlines-to-spaces" />;
}
