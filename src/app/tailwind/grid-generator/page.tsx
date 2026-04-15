import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("grid-generator");

export default function Page() {
  return <TailwindToolPage slug="grid-generator" />;
}
