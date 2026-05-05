"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Check, Quote, PenLine, AlertCircle } from "lucide-react";
import { Quote as QuoteType, QuoteTab } from "@/lib/types";

interface QuoteSearchProps {
  selectedQuote: { content: string; author: string } | null;
  onSelectQuote: (quote: { content: string; author: string }) => void;
}

export default function QuoteSearch({ selectedQuote, onSelectQuote }: QuoteSearchProps) {
  const [activeTab, setActiveTab] = useState<QuoteTab>("search");
  const [query, setQuery] = useState("");
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customContent, setCustomContent] = useState("");
  const [customAuthor, setCustomAuthor] = useState("");
  const [charCount, setCharCount] = useState(0);

  const fetchQuotes = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/quotes?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuotes(data.results || []);
    } catch {
      setError("Failed to load quotes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes("");
  }, [fetchQuotes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes(query);
  };

  const handleCustomSubmit = () => {
    if (!customContent.trim()) return;
    onSelectQuote({
      content: customContent.trim(),
      author: customAuthor.trim() || "Unknown",
    });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("search")}
          className={`pb-3 px-4 text-sm font-medium tracking-wide transition-all duration-200 ${
            activeTab === "search"
              ? "text-[var(--gold)] border-b-2 border-[var(--gold)] -mb-px"
              : "text-[var(--ash)] hover:text-[var(--parchment)]"
          }`}
        >
          Search Quotes
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`pb-3 px-4 text-sm font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
            activeTab === "custom"
              ? "text-[var(--gold)] border-b-2 border-[var(--gold)] -mb-px"
              : "text-[var(--ash)] hover:text-[var(--parchment)]"
          }`}
        >
          <PenLine className="w-3.5 h-3.5" />
          Write My Own
        </button>
      </div>

      {activeTab === "search" ? (
        <div className="space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ash)] w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword or author…"
                className="input-dark w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchQuotes("")}
              disabled={loading}
              title="Random quotes"
              className="px-3 py-2.5 rounded-lg border border-white/10 text-[var(--ash)] hover:text-[var(--parchment)] hover:border-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold px-4 py-2.5 rounded-lg text-sm"
            >
              Search
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Quotes list */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-scroll">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="shimmer h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              quotes.map((q) => {
                const isSelected = selectedQuote?.content === q.content;
                return (
                  <button
                    key={q._id}
                    onClick={() => onSelectQuote({ content: q.content, author: q.author })}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 group ${
                      isSelected
                        ? "border-[var(--gold)] bg-[var(--gold)]/8"
                        : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[var(--gold)] flex items-center justify-center">
                            <Check className="w-3 h-3 text-[var(--ink)]" />
                          </div>
                        ) : (
                          <Quote className="w-4 h-4 text-[var(--ash)] group-hover:text-[var(--gold)] transition-colors mt-0.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed line-clamp-3 ${
                          isSelected ? "text-[var(--parchment)]" : "text-[var(--parchment)]/80"
                        }`}>
                          {q.content}
                        </p>
                        <p className={`text-xs mt-1.5 font-medium ${
                          isSelected ? "text-[var(--gold)]" : "text-[var(--ash)]"
                        }`}>
                          — {q.author}
                        </p>
                        {q.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {q.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-[var(--ash)] capitalize"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}

            {!loading && quotes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--ash)]">
                <Quote className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">No quotes found. Try a different keyword.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[var(--ash)] text-sm">
            Write your own quote or paste text from any source.
          </p>
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={customContent}
                onChange={(e) => {
                  setCustomContent(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                placeholder="Enter your quote here…"
                rows={5}
                maxLength={300}
                className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none leading-relaxed"
              />
              <span className={`absolute bottom-2 right-3 text-xs ${
                charCount > 250 ? "text-amber-400" : "text-[var(--ash)]"
              }`}>
                {charCount}/300
              </span>
            </div>
            <input
              type="text"
              value={customAuthor}
              onChange={(e) => setCustomAuthor(e.target.value)}
              placeholder="Author (optional)"
              className="input-dark w-full px-4 py-3 rounded-lg text-sm"
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customContent.trim()}
              className="btn-gold w-full py-3 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Use This Quote
            </button>
          </div>

          {selectedQuote && activeTab === "custom" && (
            <div className="p-3 rounded-lg bg-[var(--gold)]/8 border border-[var(--gold)]/30">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--gold)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[var(--parchment)] line-clamp-2">{selectedQuote.content}</p>
                  <p className="text-xs text-[var(--gold)] mt-1">— {selectedQuote.author}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
