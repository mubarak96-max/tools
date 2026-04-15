import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-webp-to-png");

export default function Page() {
  return <ImageToolPage slug="convert-webp-to-png" />;
}
