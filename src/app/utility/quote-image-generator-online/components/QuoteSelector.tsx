"use client";

import { useState } from "react";

interface QuoteItem {
  _id: string;
  content: string;
  author: string;
}

interface QuoteResponse {
  results?: QuoteItem[];
}

interface QuoteErrorResponse {
  error?: string;
}

export default function QuoteSelector({
  onSelect,
}: {
  onSelect: (quote: string, author: string) => void;
}) {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [query, setQuery] = useState("");
  const [customQuote, setCustomQuote] = useState("");
  const [customAuthor, setCustomAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchQuotes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/quote-image-generator-online/quotes?query=${encodeURIComponent(query)}`);
      const data = (await response.json()) as QuoteResponse | QuoteItem[] | QuoteErrorResponse;

      if (!response.ok || ("error" in data && data.error)) {
        throw new Error("Could not load quotes");
      }

      if (Array.isArray(data)) {
        setQuotes(data);
      } else if ("results" in data && Array.isArray(data.results)) {
        setQuotes(data.results);
      } else {
        setQuotes([]);
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError("Could not load quotes right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search quotes..."
          className="flex-1 rounded-lg border border-slate-300 p-2 text-sm"
        />
        <button
          type="button"
          onClick={searchQuotes}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="space-y-2 rounded-lg bg-slate-50 p-4">
        <h4 className="font-semibold text-slate-900">Enter your own quote</h4>
        <textarea
          value={customQuote}
          onChange={(event) => setCustomQuote(event.target.value)}
          placeholder="Enter your quote..."
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
          rows={3}
        />
        <input
          type="text"
          value={customAuthor}
          onChange={(event) => setCustomAuthor(event.target.value)}
          placeholder="Author name..."
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        />
        <button
          type="button"
          onClick={() => onSelect(customQuote, customAuthor)}
          className="w-full rounded-lg bg-slate-800 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
        >
          Use Custom Quote
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {quotes.map((quote) => (
          <button
            key={quote._id}
            type="button"
            onClick={() => onSelect(quote.content, quote.author)}
            className="block w-full rounded-lg border border-slate-200 p-3 text-left transition hover:bg-blue-50"
          >
            <p className="text-sm font-medium text-slate-900">&ldquo;{quote.content}&rdquo;</p>
            <p className="mt-1 text-xs text-slate-500">- {quote.author}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
