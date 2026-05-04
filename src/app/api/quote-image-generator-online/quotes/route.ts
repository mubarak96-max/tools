import { NextRequest, NextResponse } from "next/server";

const FALLBACK_QUOTES = [
  {
    _id: "fallback-1",
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    _id: "fallback-2",
    content: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    _id: "fallback-3",
    content: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    _id: "fallback-4",
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    _id: "fallback-5",
    content: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa",
  },
  {
    _id: "fallback-6",
    content: "When you reach the end of your rope, tie a knot in it and hang on.",
    author: "Franklin D. Roosevelt",
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const url = query
    ? `https://api.quotable.io/search/quotes?query=${encodeURIComponent(query)}&limit=20`
    : "https://api.quotable.io/quotes/random?limit=20";

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Quotable API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Quote route error:", error);
    const normalizedQuery = query.trim().toLowerCase();
    const results = normalizedQuery
      ? FALLBACK_QUOTES.filter(
          (quote) =>
            quote.content.toLowerCase().includes(normalizedQuery) ||
            quote.author.toLowerCase().includes(normalizedQuery),
        )
      : FALLBACK_QUOTES;

    return NextResponse.json({ results });
  }
}
