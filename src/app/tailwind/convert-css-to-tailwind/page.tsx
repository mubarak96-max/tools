import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("convert-css-to-tailwind");

export default function Page() {
  return <TailwindToolPage slug="convert-css-to-tailwind" />;
}
