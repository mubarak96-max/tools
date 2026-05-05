import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";

  try {
    let url: string;

    if (query) {
      url = `https://api.quotable.io/search/quotes?query=${encodeURIComponent(query)}&limit=12&page=${page}`;
    } else {
      url = `https://api.quotable.io/quotes/random?limit=12`;
    }

    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`Quotable API error: ${res.status}`);
    }

    const data = await res.json();

    // Normalize response shape — search returns { results } while random returns array
    if (Array.isArray(data)) {
      return NextResponse.json({ results: data, totalCount: data.length });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Quotes API error:", error);
    // Return fallback quotes
    const fallback = [
      { _id: "f1", content: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["inspirational"] },
      { _id: "f2", content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", tags: ["inspirational"] },
      { _id: "f3", content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", tags: ["inspirational"] },
      { _id: "f4", content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["motivational"] },
      { _id: "f5", content: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", tags: ["love"] },
      { _id: "f6", content: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt", tags: ["motivational"] },
    ];
    return NextResponse.json({ results: fallback, totalCount: fallback.length });
  }
}
