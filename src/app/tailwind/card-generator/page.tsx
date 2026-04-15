import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("card-generator");

export default function Page() {
  return <TailwindToolPage slug="card-generator" />;
}
