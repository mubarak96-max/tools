import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("pixel-art-converter");

export default function Page() {
  return <ImageToolPage slug="pixel-art-converter" />;
}
