import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("character-accent-remover");

export default function Page() {
  return <ExactTextToolPage slug="character-accent-remover" />;
}
