import { NextRequest, NextResponse } from "next/server";

import { logServerError } from "@/lib/monitoring/logger";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

function normalizeUrl(input: string) {
  const candidate = input.trim().match(/^https?:\/\//i) ? input.trim() : `https://${input.trim()}`;
  const url = new URL(candidate);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  return url;
}

function toHex(value: number) {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
}

function normalizeHex(color: string) {
  const raw = color.replace("#", "").toLowerCase();

  if (raw.length === 3) {
    return `#${raw.split("").map((char) => `${char}${char}`).join("")}`;
  }

  if (raw.length === 4) {
    return `#${raw.slice(0, 3).split("").map((char) => `${char}${char}`).join("")}`;
  }

  if (raw.length >= 6) {
    return `#${raw.slice(0, 6)}`;
  }

  return null;
}

function normalizeRgb(color: string) {
  const parts = color.match(/[\d.]+/g);
  if (!parts || parts.length < 3) {
    return null;
  }

  return `#${toHex(Number(parts[0]))}${toHex(Number(parts[1]))}${toHex(Number(parts[2]))}`;
}

function hslToRgb(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const lightness = Math.max(0, Math.min(100, l)) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = chroma;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = chroma;
  } else if (hue < 300) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return {
    red: (red + m) * 255,
    green: (green + m) * 255,
    blue: (blue + m) * 255,
  };
}

function normalizeHsl(color: string) {
  const parts = color.match(/[\d.]+/g);
  if (!parts || parts.length < 3) {
    return null;
  }

  const { red, green, blue } = hslToRgb(Number(parts[0]), Number(parts[1]), Number(parts[2]));
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? "";
}

function extractStylesheetUrls(html: string, baseUrl: URL) {
  const matches = Array.from(html.matchAll(/<link[^>]+rel=["'][^"']*stylesheet[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/gi));
  return matches
    .map((match) => match[1])
    .filter(Boolean)
    .slice(0, 5)
    .map((href) => {
      try {
        return new URL(href, baseUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((href): href is string => Boolean(href));
}

function extractColors(source: string) {
  const matches = [
    ...source.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [],
    ...source.match(/rgba?\([^)]+\)/g) ?? [],
    ...source.match(/hsla?\([^)]+\)/g) ?? [],
  ];

  const counts = new Map<string, number>();

  matches.forEach((match) => {
    const normalized = match.startsWith("#")
      ? normalizeHex(match)
      : match.startsWith("rgb")
        ? normalizeRgb(match)
        : normalizeHsl(match);

    if (!normalized) {
      return;
    }

    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([color, count]) => ({ color, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 18);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "A website URL is required." }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);
    const htmlResponse = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!htmlResponse.ok) {
      return NextResponse.json({ error: "Unable to fetch the requested website." }, { status: 502 });
    }

    const html = await htmlResponse.text();
    const title = extractTitle(html);
    const stylesheetUrls = extractStylesheetUrls(html, url);
    const stylesheetChunks = await Promise.all(
      stylesheetUrls.map(async (href) => {
        try {
          const response = await fetch(href, {
            headers: {
              "User-Agent": USER_AGENT,
            },
          });
          return response.ok ? await response.text() : "";
        } catch {
          return "";
        }
      }),
    );

    const colors = extractColors([html, ...stylesheetChunks].join("\n"));

    if (!colors.length) {
      return NextResponse.json({ error: "No recurring colors were detected for that website." }, { status: 404 });
    }

    return NextResponse.json({
      title,
      colors,
    });
  } catch (error) {
    logServerError("website_palette_failed", error);
    return NextResponse.json({ error: "Unable to extract website colors right now." }, { status: 500 });
  }
}
