import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("paste-image-to-download");

export default function Page() {
  return <ImageToolPage slug="paste-image-to-download" />;
}
