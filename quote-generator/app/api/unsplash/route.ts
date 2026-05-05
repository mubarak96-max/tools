import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "nature landscape";
  const page = searchParams.get("page") || "1";

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    // Return curated fallback images when no API key is set
    const fallback = [
      {
        id: "fallback-1",
        urls: {
          small: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
          regular: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080",
          full: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          raw: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        },
        alt_description: "Mountain landscape",
        user: { name: "Samuel Ferrara", username: "samferrara" },
        width: 5472,
        height: 3648,
      },
      {
        id: "fallback-2",
        urls: {
          small: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
          regular: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080",
          full: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
          raw: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        },
        alt_description: "Sunlight through forest",
        user: { name: "Dino Reichmuth", username: "dinoreichmuth" },
        width: 5184,
        height: 3456,
      },
      {
        id: "fallback-3",
        urls: {
          small: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400",
          regular: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1080",
          full: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
          raw: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
        },
        alt_description: "Ocean waves",
        user: { name: "Veronica Reverse", username: "vereverse" },
        width: 5184,
        height: 3456,
      },
      {
        id: "fallback-4",
        urls: {
          small: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400",
          regular: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1080",
          full: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
          raw: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
        },
        alt_description: "Mountain peaks",
        user: { name: "Kalen Emsley", username: "kalenemsley" },
        width: 4016,
        height: 6016,
      },
      {
        id: "fallback-5",
        urls: {
          small: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400",
          regular: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1080",
          full: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
          raw: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
        },
        alt_description: "Aerial landscape",
        user: { name: "Boris Smokrovic", username: "borisworkshop" },
        width: 5184,
        height: 3888,
      },
      {
        id: "fallback-6",
        urls: {
          small: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
          regular: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080",
          full: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
          raw: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        },
        alt_description: "Foggy valley",
        user: { name: "Lukasz Szmigiel", username: "szmigieldesign" },
        width: 5184,
        height: 3456,
      },
    ];
    return NextResponse.json({ results: fallback, total: fallback.length });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&page=${page}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Unsplash API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
