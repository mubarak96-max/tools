"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import { FREE_TOOLS } from "@/lib/tools/registry";
import type { FreeToolMeta } from "@/types/tools";

export function ToolSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return FREE_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
  }, [query]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
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

  return (
    <div ref={containerRef} className="relative mx-auto mt-10 max-w-2xl w-full px-4 sm:px-0">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-12 text-base text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 sm:text-lg"
          placeholder="Search for tools (e.g. 'salary', 'pdf', 'image')..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">/</span>
            </kbd>
          )}
        </div>
      </div>

      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-[400px] overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {filteredTools.length > 0 ? (
            <div className="grid gap-1">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                    <FreeToolIcon tool={tool} size={20} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-foreground truncate">{tool.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{tool.description}</span>
                  </div>
                  <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 bg-muted px-2 py-0.5 rounded">
                    {tool.category}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <p className="text-sm">No tools found matching &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
