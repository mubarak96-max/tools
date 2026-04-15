import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("trim-transparent-pixels");

export default function Page() {
  return <ImageToolPage slug="trim-transparent-pixels" />;
}
