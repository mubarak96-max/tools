import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("ai-background-remover");

export default function Page() {
  return <ImageToolPage slug="ai-background-remover" />;
}
