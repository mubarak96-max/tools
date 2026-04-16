import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const urlParams = req.nextUrl.searchParams;
  const targetUrl = urlParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    const fetchUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ColorExtractorBot/1.0",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${fetchUrl}`);
    }

    const html = await response.text();

    // Regex to find CSS color codes in inline styles or text
    // E.g., #FFFFFF, #FFF, rgb(255, 255, 255), rgba(...)
    const hexRegex = /#[0-9a-fA-F]{3,6}\b/g;
    const rgbRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/gi;

    const hexMatches = html.match(hexRegex) || [];
    const rgbMatches = html.match(rgbRegex) || [];

    const allMatches = [...hexMatches, ...rgbMatches];

    if (allMatches.length === 0) {
      return NextResponse.json({
        colors: [],
        message: "No explicit colors found in the raw HTML payload.",
      });
    }

    // Standardize to uppercase hex for counting
    const colorMap = new Map<string, number>();

    for (const colorStr of allMatches) {
      let normalized = colorStr.toLowerCase();
      
      // Basic normalization of 3-digit hex to 6-digit
      if (normalized.startsWith("#") && normalized.length === 4) {
        normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
      }

      colorMap.set(normalized, (colorMap.get(normalized) || 0) + 1);
    }

    // Convert map to array and sort by frequency
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      // Filter out pure black and white if they are overwhelming, though usually fine to keep top 10
      .slice(0, 10)
      .map(([color, count]) => ({ color, count }));

    const totalCount = sortedColors.reduce((sum, item) => sum + item.count, 0);

    const result = sortedColors.map(item => ({
      ...item,
      percentage: ((item.count / totalCount) * 100).toFixed(1)
    }));

    return NextResponse.json({ colors: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process URL" }, { status: 500 });
  }
}
