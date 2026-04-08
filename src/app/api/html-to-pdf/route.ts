import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

import { logServerError } from "@/lib/monitoring/logger";

export const runtime = "nodejs";

function wrapHtmlDocument(title: string, html: string) {
  if (/<html[\s>]/iu.test(html)) {
    return html;
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>${html}</body>
</html>`;
}

export async function POST(request: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const body = await request.json();
    const rawHtml = typeof body?.html === "string" ? body.html : "";
    const title = typeof body?.title === "string" && body.title.trim() ? body.title.trim() : "HTML export";
    const format = body?.format === "Letter" ? "Letter" : "A4";

    if (!rawHtml.trim()) {
      return NextResponse.json({ error: "HTML content is required." }, { status: 400 });
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(wrapHtmlDocument(title, rawHtml), {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.emulateMediaType("screen");
    const pdf = await page.pdf({
      format,
      printBackground: true,
      margin: {
        top: "18mm",
        right: "14mm",
        bottom: "18mm",
        left: "14mm",
      },
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title.replace(/[^\w-]+/g, "-").toLowerCase() || "html-export"}.pdf"`,
      },
    });
  } catch (error) {
    logServerError("html_to_pdf_failed", error);
    return NextResponse.json({ error: "Unable to render that HTML into a PDF right now." }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
