export interface OcrProgress {
  status: string;
  progress: number;
}

export interface OcrExtractionResult {
  text: string;
  confidence: number;
  words: number;
  lines: number;
}

function normalizeExtractedText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function countLines(text: string) {
  return text ? text.split(/\n/).length : 0;
}

export async function extractTextFromImage(
  image: File | Blob,
  onProgress?: (progress: OcrProgress) => void,
): Promise<OcrExtractionResult> {
  const { createWorker, OEM } = await import("tesseract.js");

  const worker = await createWorker("eng", OEM.DEFAULT, {
    logger: (message) => {
      onProgress?.({
        status: message.status,
        progress: message.progress ?? 0,
      });
    },
  });

  try {
    const result = await worker.recognize(image);
    const text = normalizeExtractedText(result.data.text ?? "");

    return {
      text,
      confidence: result.data.confidence ?? 0,
      words: countWords(text),
      lines: countLines(text),
    };
  } finally {
    await worker.terminate();
  }
}
