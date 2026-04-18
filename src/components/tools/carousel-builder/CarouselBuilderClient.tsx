"use client";

import dynamic from "next/dynamic";

const CarouselEditor = dynamic(() => import("./CarouselEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-gray-500">Loading Carousel Editor...</p>
      </div>
    </div>
  ),
});

export default function CarouselBuilderClient() {
  return <CarouselEditor />;
}
