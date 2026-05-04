import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "nature";
  const orientation = searchParams.get("orientation") || "all";
  const apiKey = process.env.PIXABAY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "PIXABAY_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const url =
    `https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}` +
    `&q=${encodeURIComponent(query)}` +
    "&image_type=photo" +
    "&safesearch=true" +
    "&per_page=12" +
    `&orientation=${encodeURIComponent(orientation)}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Pixabay route error:", error);
    return NextResponse.json({ error: "Failed to load Pixabay images." }, { status: 500 });
  }
}
