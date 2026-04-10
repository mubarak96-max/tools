import { NextRequest, NextResponse } from "next/server";

import { logServerError } from "@/lib/monitoring/logger";

const API_BASE = "https://api.frankfurter.dev";

function parseCurrency(input: string | null) {
  const value = input?.trim().toUpperCase() ?? "";

  if (!/^[A-Z]{3}$/.test(value)) {
    return null;
  }

  return value;
}

export async function GET(request: NextRequest) {
  try {
    const from = parseCurrency(request.nextUrl.searchParams.get("from"));
    const to = parseCurrency(request.nextUrl.searchParams.get("to"));

    if (!from || !to) {
      return NextResponse.json(
        { error: "Valid three-letter from and to currency codes are required." },
        { status: 400 },
      );
    }

    if (from === to) {
      return NextResponse.json({
        date: new Date().toISOString().slice(0, 10),
        base: from,
        quote: to,
        rate: 1,
        source: "same-currency",
      });
    }

    const response = await fetch(
      `${API_BASE}/v2/rates?base=${encodeURIComponent(from)}&quotes=${encodeURIComponent(to)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message =
        payload && typeof payload.message === "string"
          ? payload.message
          : "Unable to load exchange rates right now.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = (await response.json()) as Array<{
      date: string;
      base: string;
      quote: string;
      rate: number;
    }>;
    const quote = data[0];

    if (!quote || !Number.isFinite(quote.rate)) {
      return NextResponse.json(
        { error: "No exchange rate was returned for that currency pair." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      date: quote.date,
      base: quote.base,
      quote: quote.quote,
      rate: quote.rate,
      source: "Frankfurter",
    });
  } catch (error) {
    logServerError("fx_quote_failed", error);
    return NextResponse.json(
      { error: "Unable to load exchange rates right now." },
      { status: 500 },
    );
  }
}
