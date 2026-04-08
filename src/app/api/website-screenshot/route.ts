import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

import { logServerError } from "@/lib/monitoring/logger";

export const runtime = "nodejs";

function normalizeUrl(input: string) {
  const candidate = input.trim().match(/^https?:\/\//i) ? input.trim() : `https://${input.trim()}`;
  const url = new URL(candidate);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  return url.toString();
}

export async function POST(request: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "A website URL is required." }, { status: 400 });
    }

    const width = Math.max(320, Math.min(2560, Number(body?.width) || 1440));
    const height = Math.max(320, Math.min(4000, Number(body?.height) || 960));
    const fullPage = Boolean(body?.fullPage);
    const url = normalizeUrl(rawUrl);

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    const screenshot = await page.screenshot({
      type: "png",
      fullPage,
      path: undefined,
    });

    return NextResponse.json({
      dataUrl: `data:image/png;base64,${Buffer.from(screenshot).toString("base64")}`,
    });
  } catch (error) {
    logServerError("website_screenshot_failed", error);
    return NextResponse.json({ error: "Unable to capture that website right now." }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
