"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ClipboardEvent, type DragEvent } from "react";

import { extractTextFromImage, type OcrLanguage } from "@/lib/tools/image-to-text";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const linkActionClass =
  "inline-flex rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

type OutputMode = "layout" | "paragraphs";
type SourceMode = "printed" | "handwritten";

const OCR_LANGUAGES: Array<{ value: OcrLanguage; label: string }> = [
  { value: "eng", label: "English" },
  { value: "ara", label: "Arabic" },
  { value: "fra", label: "French" },
  { value: "spa", label: "Spanish" },
  { value: "deu", label: "German" },
];

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;
}

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function countLines(text: string) {
  return text ? text.split(/\n/).length : 0;
}

function cleanSpacing(text: string) {
  return text
    .replace(/-\n(?=\p{L})/gu, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function toParagraphs(text: string) {
  return cleanSpacing(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

function getAccuracyLabel(confidence: number, output: string, sourceMode: SourceMode) {
  if (!output) {
    return {
      label: "Not analyzed",
      className: "slate-chip",
      help: "Upload an image and run OCR to estimate extraction quality.",
    };
  }

  if (sourceMode === "handwritten") {
    return {
      label: confidence >= 75 ? "Medium accuracy" : "Needs review",
      className: confidence >= 75 ? "warning-chip" : "danger-chip",
      help: "Handwriting varies widely, so review names, numbers, and punctuation carefully.",
    };
  }

  if (confidence >= 85) {
    return {
      label: "High accuracy",
      className: "success-chip",
      help: "The image likely has clear printed text, but still review critical details.",
    };
  }

  if (confidence >= 60) {
    return {
      label: "Medium accuracy",
      className: "warning-chip",
      help: "Some words may need correction. Try contrast mode, rotation, or a sharper image.",
    };
  }

  return {
    label: "Needs review",
    className: "danger-chip",
    help: "OCR struggled with this image. Crop, rotate, increase contrast, or upload a clearer file.",
  };
}

function getStageLabel(status: string, progress: number) {
  if (status === "loading tesseract core" || status === "initializing tesseract") {
    return "Loading OCR engine";
  }

  if (status === "loading language traineddata" || status === "initializing api") {
    return "Loading language model";
  }

  if (status === "recognizing text") {
    return "Detecting and recognizing characters";
  }

  if (progress > 0) {
    return status.replace(/^\w/, (letter) => letter.toUpperCase());
  }

  return "Preparing image";
}

async function prepareImageForOcr(file: File, rotation: number, highContrast: boolean): Promise<File | Blob> {
  if (rotation === 0 && !highContrast) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const source = URL.createObjectURL(file);

    image.onload = () => {
      const radians = (rotation * Math.PI) / 180;
      const quarterTurn = rotation === 90 || rotation === 270;
      const canvas = document.createElement("canvas");
      canvas.width = quarterTurn ? image.naturalHeight : image.naturalWidth;
      canvas.height = quarterTurn ? image.naturalWidth : image.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(source);
        reject(new Error("Could not prepare image for OCR."));
        return;
      }

      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(radians);
      context.filter = highContrast ? "grayscale(1) contrast(1.65)" : "none";
      context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      URL.revokeObjectURL(source);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not prepare image for OCR."));
          }
        },
        file.type || "image/png",
        0.95,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("Could not load image for preprocessing."));
    };

    image.src = source;
  });
}

function getFilesFromList(fileList: FileList | null) {
  return Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
}

export default function ImageToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [words, setWords] = useState(0);
  const [lines, setLines] = useState(0);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Upload an image to start OCR.");
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [language, setLanguage] = useState<OcrLanguage>("eng");
  const [sourceMode, setSourceMode] = useState<SourceMode>("printed");
  const [outputMode, setOutputMode] = useState<OutputMode>("layout");
  const [rotation, setRotation] = useState(0);
  const [highContrast, setHighContrast] = useState(false);

  const isProcessing = status !== "idle" && status !== "done" && status !== "error";
  const output = outputMode === "paragraphs" ? toParagraphs(rawOutput) : rawOutput;
  const accuracy = getAccuracyLabel(confidence, output, sourceMode);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fileMeta = useMemo(
    () => ({
      name:
        files.length === 0
          ? "No image selected"
          : files.length === 1
            ? files[0].name
            : `${files.length} images selected`,
      size: files.length
        ? `${(files.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
        : "0 MB",
    }),
    [files],
  );

  function updateFiles(nextFiles: File[]) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!nextFiles.length) {
      setFiles([]);
      setPreviewUrl(null);
      return;
    }

    setFiles(nextFiles);
    setPreviewUrl(URL.createObjectURL(nextFiles[0]));
    setRawOutput("");
    setConfidence(0);
    setWords(0);
    setLines(0);
    setStatus("idle");
    setProgress(0);
    setStage("Ready to extract text.");
    setError(null);
    setCopyState("idle");
  }

  async function handleExtract() {
    if (!files.length) {
      setError("Choose one or more images first.");
      return;
    }

    setError(null);
    setRawOutput("");
    setStatus("loading");
    setProgress(2);
    setStage("Preparing image");

    try {
      const extractedSections: string[] = [];
      let totalConfidence = 0;
      let totalWords = 0;
      let totalLines = 0;

      for (let index = 0; index < files.length; index += 1) {
        const currentFile = files[index];
        const preparedImage = await prepareImageForOcr(currentFile, rotation, highContrast);

        const result = await extractTextFromImage(preparedImage, language, (message) => {
          const fileProgress = Math.max(0, Math.min(1, message.progress || 0));
          const combinedProgress = ((index + fileProgress) / files.length) * 100;
          setProgress(Math.max(4, combinedProgress));
          setStage(`${getStageLabel(message.status, fileProgress)} (${index + 1}/${files.length})`);
        });

        totalConfidence += result.confidence;
        totalWords += result.words;
        totalLines += result.lines;
        extractedSections.push(
          files.length > 1 ? `--- ${currentFile.name} ---\n${result.text || "[No text detected]"}` : result.text,
        );
      }

      const joinedOutput = cleanSpacing(extractedSections.join("\n\n"));
      setRawOutput(joinedOutput);
      setConfidence(totalConfidence / files.length);
      setWords(totalWords || countWords(joinedOutput));
      setLines(totalLines || countLines(joinedOutput));
      setProgress(100);
      setStage("OCR complete. Review and clean the extracted text.");
      setStatus("done");
    } catch (ocrError) {
      const message = ocrError instanceof Error ? ocrError.message : "OCR failed.";
      setError(message);
      setStage("OCR failed. Try a clearer image or a different language.");
      setStatus("error");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  function handleDownloadTxt() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "extracted-image-text.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleCleanFormatting() {
    const cleaned = outputMode === "paragraphs" ? toParagraphs(rawOutput) : cleanSpacing(rawOutput);
    setRawOutput(cleaned);
    setOutputMode("layout");
    setWords(countWords(cleaned));
    setLines(countLines(cleaned));
  }

  function handleClear() {
    updateFiles([]);
    setRawOutput("");
    setConfidence(0);
    setWords(0);
    setLines(0);
    setStatus("idle");
    setProgress(0);
    setStage("Upload an image to start OCR.");
    setError(null);
    setRotation(0);
    setHighContrast(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    updateFiles(getFilesFromList(event.dataTransfer.files));
  }

  function handlePaste(event: ClipboardEvent<HTMLLabelElement>) {
    const pastedFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file && file.type.startsWith("image/")));

    if (pastedFiles.length) {
      updateFiles(pastedFiles);
    }
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Upload image</span>
              <label
                className="flex min-h-[14rem] cursor-pointer items-center justify-center rounded-[1.25rem] border border-dashed border-border bg-background p-4 text-center outline-none focus:ring-2 focus:ring-primary"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onPaste={handlePaste}
                tabIndex={0}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/bmp"
                  multiple
                  className="hidden"
                  onChange={(event) => updateFiles(getFilesFromList(event.target.files))}
                />
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="OCR preview"
                    width={1200}
                    height={900}
                    unoptimized
                    className="max-h-[18rem] w-auto rounded-[1rem] object-contain"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      filter: highContrast ? "grayscale(1) contrast(1.65)" : undefined,
                    }}
                  />
                ) : (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Drag, paste, or choose images to extract text</p>
                    <p>Supports JPG, PNG, WEBP, and BMP. Multiple images are combined into one OCR result.</p>
                  </div>
                )}
              </label>
              {error ? <p className="text-sm text-danger-soft-foreground">{error}</p> : null}
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Extracted text</span>
              <textarea
                value={output}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="OCR output appears here after extraction."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">OCR language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value as OcrLanguage)} className={fieldClass}>
                  {OCR_LANGUAGES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Text type</span>
                <select value={sourceMode} onChange={(event) => setSourceMode(event.target.value as SourceMode)} className={fieldClass}>
                  <option value="printed">Printed text</option>
                  <option value="handwritten">Handwritten text</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Output mode</span>
                <select value={outputMode} onChange={(event) => setOutputMode(event.target.value as OutputMode)} className={fieldClass}>
                  <option value="layout">Preserve layout</option>
                  <option value="paragraphs">Clean paragraphs</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Image details</span>
                <div className={fieldClass}>
                  <div className="font-semibold text-foreground">{fileMeta.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{fileMeta.size}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleExtract} disabled={!files.length || isProcessing} className={buttonClass}>
                  {isProcessing ? "Extracting..." : "Extract text"}
                </button>
                <button type="button" onClick={handleCopy} disabled={!output} className={buttonClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy text"}
                </button>
                <button type="button" onClick={handleDownloadTxt} disabled={!output} className={buttonClass}>
                  Download TXT
                </button>
                <button type="button" onClick={handleCleanFormatting} disabled={!output} className={buttonClass}>
                  Clean formatting
                </button>
                <button type="button" onClick={handleClear} className={buttonClass}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Processing status</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{isProcessing ? "Extracting text..." : stage}</h2>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${accuracy.className}`}>
                {accuracy.label}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{accuracy.help}</p>
          </div>

          {output ? (
            <div className="rounded-[1.5rem] border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Next steps</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/text/word-frequency" className={linkActionClass}>
                  Send to word counter
                </Link>
                <Link href="/text/readability-flesch-kincaid-calculator" className={linkActionClass}>
                  Check readability
                </Link>
                <Link href="/text/character-counter" className={linkActionClass}>
                  Count characters
                </Link>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Copy the extracted text first, then open the next tool to continue editing, counting, or reviewing readability.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">OCR stats</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Image-to-text snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Confidence</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{formatPercent(confidence)}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Words found</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{words}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Lines found</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{lines}</p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Image prep</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setRotation((value) => (value + 90) % 360)} className={buttonClass}>
                Rotate
              </button>
              <button type="button" onClick={() => setHighContrast((value) => !value)} className={buttonClass}>
                {highContrast ? "Normal contrast" : "High contrast"}
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Rotation and contrast are applied before OCR. Crop support is planned for a future pass.
            </p>
          </div>

          <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm leading-6 text-primary-soft-foreground">
              Images are processed in your browser for OCR and are not stored by this tool. Results still depend on image quality, lighting, alignment, and font clarity.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
