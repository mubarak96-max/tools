import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("online-collage-maker");

export default function Page() {
  return <ImageToolPage slug="online-collage-maker" />;
}
