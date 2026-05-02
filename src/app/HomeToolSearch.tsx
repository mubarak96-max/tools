"use client";

import Link from "next/link";
import { Command, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ALL_TOOLS } from "@/lib/tools-data";

const SEARCH_TOOLS = ALL_TOOLS;

export default function HomeToolSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popularSearches = ["resume", "background", "qr", "ocr", "text", "binary"];

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return SEARCH_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("home-tool-searches");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        window.requestAnimationFrame(() => {
          setRecentQueries(parsed.filter((item): item is string => typeof item === "string").slice(0, 4));
        });
      }
    } catch {
      // Keep search usable when local storage is unavailable.
    }
  }, []);

  function saveRecentQuery(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;
    const next = [normalized, ...recentQueries.filter((item) => item !== normalized)].slice(0, 4);
    setRecentQueries(next);
    try {
      window.localStorage.setItem("home-tool-searches", JSON.stringify(next));
    } catch {
      // Keep search usable when local storage is unavailable.
    }
  }

  function handleQuickSearch(value: string) {
    setQuery(value);
    setIsOpen(true);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="group relative mx-auto mt-6 w-full">
      <div className="group/input relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
          <Search className="h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within/input:text-primary" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full rounded-full border border-white/40 bg-white/60 py-5 pl-14 pr-24 text-lg text-slate-900 placeholder-slate-400 shadow-premium backdrop-blur-xl transition-all duration-300 focus:border-primary/20 focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary/5 sm:text-xl"
          placeholder="What do you need to do today?..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-6">
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/50 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-400 shadow-inner sm:flex">
              <Command className="h-3 w-3" />
              <span>/</span>
            </div>
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="absolute left-0 right-0 z-50 mt-4 max-h-[460px] overflow-y-auto rounded-[2.5rem] border border-white/40 bg-white/95 p-4 shadow-hover backdrop-blur-2xl animate-fade-in">
          {query.trim() ? (
            filteredTools.length > 0 ? (
              <div className="grid gap-1">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Search Results
                </p>
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-3 rounded-2xl p-3 transition-all hover:scale-[1.01] hover:bg-primary/5"
                    onClick={() => {
                      saveRecentQuery(query);
                      setIsOpen(false);
                    }}
                  >
                    <span className="flex min-w-0 flex-col overflow-hidden">
                      <span className="truncate text-sm font-bold text-slate-900">{tool.name}</span>
                      <span className="truncate text-xs text-slate-500">{tool.description}</span>
                    </span>
                    <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                      {tool.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-[15px] font-semibold text-slate-900">No tools found</p>
                <p className="mt-1 text-sm text-slate-500">Try searching for &quot;cv&quot;, &quot;image&quot; or &quot;qr&quot;</p>
              </div>
            )
          ) : (
            <div className="space-y-8 p-2">
              <div>

                <div className="mt-1 flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleQuickSearch(item)}
                      className="rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary-soft hover:text-primary active:translate-y-0"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {recentQueries.length > 0 ? (
                <div>
                  <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Your Recent Searches
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recentQueries.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleQuickSearch(item)}
                        className="rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary-soft hover:text-primary active:translate-y-0"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
