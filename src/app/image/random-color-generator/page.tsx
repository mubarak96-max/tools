import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("random-color-generator");

export default function Page() {
  return <ImageToolPage slug="random-color-generator" />;
}
