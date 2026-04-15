import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("shadow-generator");

export default function Page() {
  return <TailwindToolPage slug="shadow-generator" />;
}
