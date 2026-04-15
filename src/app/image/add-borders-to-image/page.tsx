import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("add-borders-to-image");

export default function Page() {
  return <ImageToolPage slug="add-borders-to-image" />;
}
