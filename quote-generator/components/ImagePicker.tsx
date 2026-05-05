"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Link, RefreshCw, Check, ImageIcon, AlertCircle } from "lucide-react";
import { UnsplashImage, Tab } from "@/lib/types";

interface ImagePickerProps {
  selectedImage: string | null;
  onSelectImage: (url: string) => void;
}

export default function ImagePicker({ selectedImage, onSelectImage }: ImagePickerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("unsplash");
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [customUrlError, setCustomUrlError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchImages = useCallback(async (searchQuery: string, pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/unsplash?query=${encodeURIComponent(searchQuery || "nature landscape")}&page=${pageNum}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImages(data.results || []);
    } catch {
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages("nature landscape");
  }, [fetchImages]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchImages(query || "nature landscape");
  };

  const handleCustomUrl = () => {
    setCustomUrlError(null);
    if (!customUrl.trim()) {
      setCustomUrlError("Please enter an image URL.");
      return;
    }
    try {
      new URL(customUrl);
      onSelectImage(customUrl);
    } catch {
      setCustomUrlError("Please enter a valid URL.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("unsplash")}
          className={`pb-3 px-4 text-sm font-medium tracking-wide transition-all duration-200 ${
            activeTab === "unsplash"
              ? "text-[var(--gold)] border-b-2 border-[var(--gold)] -mb-px"
              : "text-[var(--ash)] hover:text-[var(--parchment)]"
          }`}
        >
          Browse Unsplash
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`pb-3 px-4 text-sm font-medium tracking-wide transition-all duration-200 ${
            activeTab === "custom"
              ? "text-[var(--gold)] border-b-2 border-[var(--gold)] -mb-px"
              : "text-[var(--ash)] hover:text-[var(--parchment)]"
          }`}
        >
          Custom URL
        </button>
      </div>

      {activeTab === "unsplash" ? (
        <div className="space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ash)] w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search landscapes, cities, abstract…"
                className="input-dark w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Image Grid */}
          {loading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shimmer aspect-video rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 stagger">
              {images.map((img) => {
                const isSelected = selectedImage === img.urls.regular;
                return (
                  <button
                    key={img.id}
                    onClick={() => onSelectImage(img.urls.regular)}
                    className={`relative group aspect-video rounded-lg overflow-hidden animate-fade-up card-hover ${
                      isSelected ? "ring-2 ring-[var(--gold)]" : ""
                    }`}
                    title={img.alt_description || "Unsplash image"}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.urls.small}
                      alt={img.alt_description || "Unsplash image"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 transition-all duration-200 ${
                      isSelected
                        ? "bg-[var(--gold)]/20"
                        : "bg-black/0 group-hover:bg-black/20"
                    }`} />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-[var(--gold)] rounded-full p-0.5">
                        <Check className="w-3 h-3 text-[var(--ink)]" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-xs truncate">by {img.user.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {images.length === 0 && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--ash)]">
              <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm">No images found. Try a different search.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[var(--ash)] text-sm leading-relaxed">
            Paste any publicly accessible image URL. For best results, use high-resolution images with
            a 16:9 aspect ratio.
          </p>
          <div className="space-y-3">
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ash)] w-4 h-4" />
              <input
                type="url"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  setCustomUrlError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCustomUrl()}
                placeholder="https://example.com/image.jpg"
                className="input-dark w-full pl-9 pr-4 py-3 rounded-lg text-sm"
              />
            </div>
            {customUrlError && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {customUrlError}
              </p>
            )}
            <button
              onClick={handleCustomUrl}
              className="btn-gold w-full py-3 rounded-lg text-sm"
            >
              Use This Image
            </button>
          </div>

          {/* Preview of custom URL */}
          {selectedImage && !selectedImage.includes("unsplash.com") && (
            <div className="mt-4">
              <p className="text-[var(--ash)] text-xs mb-2 uppercase tracking-wider">Current image</p>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Custom image preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
            <p className="text-amber-400/80 text-xs leading-relaxed">
              <strong>Note:</strong> Some external URLs may not load due to CORS restrictions. If the
              preview doesn't appear, try using an Unsplash image instead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
