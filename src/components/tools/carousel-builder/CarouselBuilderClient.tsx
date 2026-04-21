"use client";

import dynamic from "next/dynamic";

const CarouselSkeleton = () => (
  <div className="flex flex-col gap-4 max-w-[560px] mx-auto pb-12 animate-pulse">
    {/* Top Toolbar Skeleton */}
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex-[1.2] h-11 bg-gray-50 rounded-lg" />
        <div className="flex-1 h-11 bg-gray-50 rounded-lg" />
        <div className="flex-1 h-11 bg-gray-50 rounded-lg" />
      </div>
      <div className="flex justify-end mt-2">
        <div className="w-28 h-8 bg-gray-50 rounded-lg" />
      </div>
    </div>

    {/* Export Bar Skeleton */}
    <div className="flex items-center gap-2 px-1">
      <div className="w-24 h-4 bg-gray-100 rounded mr-auto" />
      <div className="w-24 h-8 bg-gray-100 rounded-lg" />
      <div className="w-28 h-8 bg-gray-100 rounded-lg" />
    </div>

    {/* Canvas Preview Skeleton */}
    <div className="relative aspect-[4/5] w-full items-center justify-center rounded-xl bg-gray-100 border border-gray-100">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-32 h-32 rounded-full border-4 border-gray-400" />
      </div>
    </div>

    {/* Nav Bar Skeleton */}
    <div className="h-11 w-full flex border border-gray-100 bg-white rounded-lg divide-x divide-gray-100 overflow-hidden">
      <div className="flex-1 bg-gray-50/50" />
      <div className="flex-1 bg-gray-50/50" />
      <div className="flex-1 bg-gray-50/50" />
      <div className="flex-1 bg-gray-50/50" />
    </div>

    {/* Editor Fields Skeleton */}
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
      <div className="h-10 w-full bg-gray-50 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 w-1/4 bg-gray-100 rounded" />
        <div className="h-12 w-full bg-gray-50 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-gray-100 rounded" />
        <div className="h-24 w-full bg-gray-50 rounded-lg" />
      </div>
    </div>
  </div>
);

const CarouselEditor = dynamic(() => import("./CarouselEditor"), {
  loading: () => <CarouselSkeleton />,
});

export default function CarouselBuilderClient() {
  return <CarouselEditor />;
}
