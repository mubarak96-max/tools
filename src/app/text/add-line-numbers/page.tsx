import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("add-line-numbers");

export default function Page() {
  return <ExactTextToolPage slug="add-line-numbers" />;
}
