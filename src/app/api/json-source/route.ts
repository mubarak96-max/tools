import { NextRequest, NextResponse } from "next/server";

import { logServerError } from "@/lib/monitoring/logger";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";
const MAX_JSON_BYTES = 2 * 1024 * 1024;

function normalizeUrl(input: string) {
  const candidate = input.trim().match(/^https?:\/\//i) ? input.trim() : `https://${input.trim()}`;
  const url = new URL(candidate);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  return url;
}

function parseJsonPayload(raw: string) {
  const normalized = raw.replace(/^\uFEFF/, "").trim();

  if (!normalized) {
    throw new Error("The provided source was empty.");
  }

  if (normalized.length > MAX_JSON_BYTES) {
    throw new Error("That JSON source is too large to load here.");
  }

  return JSON.stringify(JSON.parse(normalized), null, 2);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "A JSON URL is required." }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json,text/plain;q=0.9,*/*;q=0.1",
        "User-Agent": USER_AGENT,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to fetch that JSON URL." }, { status: 502 });
    }

    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
      return NextResponse.json({ error: "That JSON source is too large to load here." }, { status: 413 });
    }

    const raw = await response.text();
    const json = parseJsonPayload(raw);

    return NextResponse.json({ json });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load JSON from that URL right now.";

    if (message === "Only http and https URLs are supported." || message === "The provided source was empty." || message === "That JSON source is too large to load here.") {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "The URL did not return valid JSON." }, { status: 400 });
    }

    logServerError("json_source_fetch_failed", error);
    return NextResponse.json({ error: "Unable to load JSON from that URL right now." }, { status: 500 });
  }
}
