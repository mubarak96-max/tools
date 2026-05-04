"use client";

import { useState } from "react";

interface PixabayImage {
  id: number;
  largeImageURL: string;
  webformatURL: string;
  user: string;
}

interface PixabayResponse {
  hits: PixabayImage[];
}

export default function ImageSelector({
  format,
  selectedImage,
  onSelect,
}: {
  format: "square" | "portrait";
  selectedImage: string;
  onSelect: (url: string) => void;
}) {
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewClass = format === "portrait" ? "aspect-[9/16]" : "aspect-square";
  const resultsHeightClass = format === "portrait" ? "max-h-[520px]" : "max-h-[320px]";

  const searchPixabay = async () => {
    setLoading(true);
    setError("");

    try {
      const orientation = format === "portrait" ? "vertical" : "all";
      const response = await fetch(
        `/api/quote-image-generator-online/pixabay?query=${encodeURIComponent(query)}&orientation=${orientation}`,
      );
      const data = (await response.json()) as PixabayResponse & { error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to load images");
      }

      setImages(data.hits || []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Could not load images right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const localUrl = URL.createObjectURL(file);
    onSelect(localUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Pixabay..."
          className="flex-1 rounded-lg border border-slate-300 p-2 text-sm"
        />
        <button
          type="button"
          onClick={searchPixabay}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center">
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <p className="mt-1 text-sm text-slate-500">Or upload your own image</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className={`${resultsHeightClass} overflow-y-auto pr-1`}>
        <div className="grid grid-cols-2 gap-2">
          {images.map((image) => {
            const isSelected = selectedImage === image.largeImageURL;

            return (
              <button
                key={image.id}
                type="button"
                className={`group relative ${previewClass} overflow-hidden rounded-lg border-2 transition ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-transparent hover:border-slate-300"
                }`}
                onClick={() => onSelect(image.largeImageURL)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.webformatURL}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  {image.user}
                </div>
                {isSelected ? (
                  <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                    Selected
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
