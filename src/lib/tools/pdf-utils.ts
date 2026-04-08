import { PDFFont, PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";

export async function readPdfFile(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await PDFDocument.load(bytes);
  return { bytes, document };
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.slice().buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function stemFilename(name: string) {
  return name.replace(/\.[^.]+$/u, "");
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

export function parsePageSelection(input: string, pageCount: number) {
  const tokens = input
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    throw new Error("Enter at least one page number or range.");
  }

  const selected = new Set<number>();

  for (const token of tokens) {
    if (token.includes("-")) {
      const [startRaw, endRaw] = token.split("-").map((part) => Number(part.trim()));
      if (!Number.isFinite(startRaw) || !Number.isFinite(endRaw) || startRaw < 1 || endRaw < 1 || startRaw > endRaw) {
        throw new Error(`Invalid page range: ${token}`);
      }

      for (let page = startRaw; page <= endRaw; page += 1) {
        if (page > pageCount) {
          throw new Error(`Page ${page} is outside this PDF.`);
        }
        selected.add(page - 1);
      }
    } else {
      const page = Number(token);
      if (!Number.isFinite(page) || page < 1 || page > pageCount) {
        throw new Error(`Page ${token} is outside this PDF.`);
      }
      selected.add(page - 1);
    }
  }

  return Array.from(selected).sort((left, right) => left - right);
}

export function buildRemainingPages(pageCount: number, removedIndexes: number[]) {
  const removed = new Set(removedIndexes);
  const remaining = Array.from({ length: pageCount }, (_, index) => index).filter((index) => !removed.has(index));

  if (!remaining.length) {
    throw new Error("You cannot remove every page from the PDF.");
  }

  return remaining;
}

export function parseOrderedPageSelection(input: string, pageCount: number) {
  const tokens = input
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    throw new Error("Enter the full page order using page numbers and ranges.");
  }

  const ordered: number[] = [];

  for (const token of tokens) {
    if (token.includes("-")) {
      const [startRaw, endRaw] = token.split("-").map((part) => Number(part.trim()));
      if (!Number.isFinite(startRaw) || !Number.isFinite(endRaw) || startRaw < 1 || endRaw < 1) {
        throw new Error(`Invalid page range: ${token}`);
      }

      const step = startRaw <= endRaw ? 1 : -1;
      for (let page = startRaw; step > 0 ? page <= endRaw : page >= endRaw; page += step) {
        if (page > pageCount) {
          throw new Error(`Page ${page} is outside this PDF.`);
        }
        ordered.push(page - 1);
      }
    } else {
      const page = Number(token);
      if (!Number.isFinite(page) || page < 1 || page > pageCount) {
        throw new Error(`Page ${token} is outside this PDF.`);
      }
      ordered.push(page - 1);
    }
  }

  return ordered;
}

export function ensureEveryPageSelected(pageCount: number, orderedIndexes: number[]) {
  if (orderedIndexes.length !== pageCount) {
    throw new Error(`Use all ${pageCount} pages once when you organize the PDF.`);
  }

  const seen = new Set(orderedIndexes);
  if (seen.size !== pageCount) {
    throw new Error("Each page should appear exactly once in the new page order.");
  }
}

export function decodeXmlText(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#10;/g, "\n");
}

export async function createTextPdf({
  title,
  sections,
}: {
  title?: string;
  sections: Array<{
    heading?: string;
    lines: string[];
  }>;
}) {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const boldFont = await document.embedFont(StandardFonts.HelveticaBold);
  const pageSize = PageSizes.A4;
  const margin = 48;
  const lineHeight = 16;
  const headingGap = 12;
  const titleSize = 20;
  const headingSize = 13;
  const textSize = 10;
  const pageWidth = pageSize[0];
  const pageHeight = pageSize[1];

  let page = document.addPage(pageSize);
  let cursorY = pageHeight - margin;

  const ensureSpace = (required: number) => {
    if (cursorY - required < margin) {
      page = document.addPage(pageSize);
      cursorY = pageHeight - margin;
    }
  };

  if (title) {
    page.drawText(title, {
      x: margin,
      y: cursorY,
      size: titleSize,
      font: boldFont,
      color: rgb(0.08, 0.12, 0.16),
      maxWidth: pageWidth - margin * 2,
    });
    cursorY -= titleSize + 18;
  }

  for (const section of sections) {
    if (section.heading) {
      ensureSpace(headingSize + headingGap);
      page.drawText(section.heading, {
        x: margin,
        y: cursorY,
        size: headingSize,
        font: boldFont,
        color: rgb(0.08, 0.12, 0.16),
        maxWidth: pageWidth - margin * 2,
      });
      cursorY -= headingSize + headingGap;
    }

    for (const rawLine of section.lines) {
      const line = rawLine.length ? rawLine : " ";
      const wrapped = wrapText(line, font, textSize, pageWidth - margin * 2);
      for (const part of wrapped) {
        ensureSpace(lineHeight);
        page.drawText(part, {
          x: margin,
          y: cursorY,
          size: textSize,
          font,
          color: rgb(0.16, 0.2, 0.25),
        });
        cursorY -= lineHeight;
      }
    }

    cursorY -= 10;
  }

  return document.save();
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/u);
  if (words.length === 1 && font.widthOfTextAtSize(text, size) <= maxWidth) {
    return [text];
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
      continue;
    }

    let fragment = "";
    for (const character of word) {
      const candidate = `${fragment}${character}`;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        fragment = candidate;
      } else {
        lines.push(fragment);
        fragment = character;
      }
    }
    current = fragment;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [text];
}
