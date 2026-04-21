import { notFound } from "next/navigation";

export const revalidate = 43200;
export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function TextToolPage() {
  notFound();
}
