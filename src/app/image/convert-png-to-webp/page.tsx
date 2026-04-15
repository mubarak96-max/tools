import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-png-to-webp");

export default function Page() {
  return <ImageToolPage slug="convert-png-to-webp" />;
}
