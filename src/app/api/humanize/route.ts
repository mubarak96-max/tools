import { NextRequest, NextResponse } from "next/server";

import { logServerError } from "@/lib/monitoring/logger";
import {
  buildHumanizerPrompt,
  HUMANIZER_MODEL,
  MAX_INPUT_LENGTH,
  sanitizeInput,
} from "@/lib/tools/humanizer";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const ipCounts = new Map<string, RateLimitEntry>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  if (entry.count >= LIMIT) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { limited: false, retryAfter: 0 };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited, retryAfter } = checkRateLimit(ip);

  if (limited) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text field." }, { status: 400 });
    }

    const trimmed = sanitizeInput(text);

    if (trimmed.length === 0) {
      return NextResponse.json({ error: "Text cannot be empty." }, { status: 400 });
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds the ${MAX_INPUT_LENGTH} character limit.` },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://findbest.tools",
        "X-Title": "findbesttool AI Humanizer",
      },
      body: JSON.stringify({
        model: HUMANIZER_MODEL,
        messages: buildHumanizerPrompt(trimmed),
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logServerError("humanize_openrouter_failed", errorBody, {
        status: response.status,
      });
      return NextResponse.json(
        { error: "Rewriting failed. Please try again." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const humanized = data.choices?.[0]?.message?.content?.trim();

    if (!humanized) {
      return NextResponse.json(
        { error: "No output received. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ humanized });
  } catch (error) {
    logServerError("humanize_route_failed", error, { ip });
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
