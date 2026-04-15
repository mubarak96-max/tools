import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-image-to-ascii-converter");

export default function Page() {
  return <ImageToolPage slug="convert-image-to-ascii-converter" />;
}
