"use client";

import { useId, useMemo, useState } from "react";

import type { ExactConverterTool } from "@/lib/tools/exact-catalog";
import { convertDataFormat } from "@/lib/tools/data-format-converter";
import { transformEncoding, type EncodingMode } from "@/lib/tools/encoding-tools";
import { convertTime } from "@/lib/tools/time-converter";
import { convertUnit } from "@/lib/tools/unit-converter";

import { actionClass, inputClass, panelClass, textareaClass } from "./shared";

type JsonInputSource = "paste" | "url" | "file";
type Base64UiMode = "encode" | "decode";
type Base64InputSource = "text" | "file";
type Base64OutputFormat = "raw" | "data-url" | "url-safe";
type Base64ConverterTool = ExactConverterTool & {
  family: "encoding";
  mode: "base64-encode" | "base64-decode";
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function extractBase64Parts(value: string) {
  const trimmed = value.trim();
  const dataUrlMatch = trimmed.match(/^data:([^;,]+(?:;[^;,]+)?)?;base64,(.*)$/i);

  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1] || "application/octet-stream",
      raw: dataUrlMatch[2],
    };
  }

  return {
    mimeType: "",
    raw: trimmed,
  };
}

function decodeBase64ToBytes(value: string) {
  const { mimeType, raw } = extractBase64Parts(value);
  const normalized = raw.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");

  if (!normalized) {
    return { bytes: new Uint8Array(), mimeType, rawBase64: "" };
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error("Invalid Base64 string. Check the characters and padding.");
  }

  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return {
    bytes,
    mimeType,
    rawBase64: padded,
  };
}

function getUtf8Text(bytes: Uint8Array) {
  if (bytes.length === 0) {
    return "";
  }

  const strictDecoder = new TextDecoder("utf-8", { fatal: true });
  return strictDecoder.decode(bytes);
}

function toDataUrl(base64: string, mimeType: string) {
  return `data:${mimeType || "application/octet-stream"};base64,${base64}`;
}

function toUrlSafeBase64(base64: string) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_");
}

function getBase64RouteTitle(mode: Base64UiMode) {
  return mode === "encode" ? "Base64 encode" : "Base64 decode";
}

function Base64ConverterPanel({ tool }: { tool: Base64ConverterTool }) {
  const fileInputId = useId();
  const [mode, setMode] = useState<Base64UiMode>(tool.mode === "base64-decode" ? "decode" : "encode");
  const [inputSource, setInputSource] = useState<Base64InputSource>("text");
  const [text, setText] = useState("");
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("text/plain;charset=utf-8");
  const [outputFormat, setOutputFormat] = useState<Base64OutputFormat>("raw");
  const [statusMessage, setStatusMessage] = useState("");

  const encodeResult = useMemo(() => {
    if (mode !== "encode") return null;

    const bytes =
      inputSource === "file"
        ? fileBytes
        : text.length > 0
          ? new TextEncoder().encode(text)
          : new Uint8Array();

    if (!bytes || bytes.length === 0) {
      return {
        rawBase64: "",
        output: "",
        originalBytes: 0,
        encodedBytes: 0,
      };
    }

    const rawBase64 = bytesToBase64(bytes);
    const output =
      outputFormat === "raw"
        ? rawBase64
        : outputFormat === "data-url"
          ? toDataUrl(rawBase64, mimeType)
          : toUrlSafeBase64(rawBase64);

    return {
      rawBase64,
      output,
      originalBytes: bytes.length,
      encodedBytes: rawBase64.length,
    };
  }, [mode, inputSource, fileBytes, text, outputFormat, mimeType]);

  const decodeResult = useMemo(() => {
    if (mode !== "decode") return null;

    if (!text.trim()) {
      return {
        decodedText: "",
        mimeType: "",
        rawBase64: "",
        decodedBytes: 0,
        encodedBytes: 0,
        dataUrl: "",
        isText: true,
        error: "",
      };
    }

    try {
      const decoded = decodeBase64ToBytes(text);
      const effectiveMime = decoded.mimeType || mimeType || "application/octet-stream";
      let decodedText = "";
      let isText = false;

      try {
        decodedText = getUtf8Text(decoded.bytes);
        isText = true;
      } catch {
        decodedText = "";
        isText = false;
      }

      return {
        decodedText,
        mimeType: effectiveMime,
        rawBase64: decoded.rawBase64,
        decodedBytes: decoded.bytes.length,
        encodedBytes: decoded.rawBase64.length,
        dataUrl: toDataUrl(decoded.rawBase64, effectiveMime),
        isText,
        error: "",
      };
    } catch (error) {
      return {
        decodedText: "",
        mimeType: "",
        rawBase64: "",
        decodedBytes: 0,
        encodedBytes: 0,
        dataUrl: "",
        isText: false,
        error: error instanceof Error ? error.message : "Unable to decode this Base64 value.",
      };
    }
  }, [mode, text, mimeType]);

  const activeOutput = mode === "encode" ? (encodeResult?.output ?? "") : (decodeResult?.decodedText ?? "");
  const activeError = mode === "decode" ? decodeResult?.error : "";
  const sizeDelta =
    mode === "encode"
      ? encodeResult && encodeResult.originalBytes > 0
        ? ((encodeResult.encodedBytes - encodeResult.originalBytes) / encodeResult.originalBytes) * 100
        : null
      : decodeResult && decodeResult.decodedBytes > 0
        ? ((decodeResult.encodedBytes - decodeResult.decodedBytes) / decodeResult.decodedBytes) * 100
        : null;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const buffer = await file.arrayBuffer();
    setFileBytes(new Uint8Array(buffer));
    setFileName(`${file.name} (${formatBytes(file.size)})`);
    setMimeType(file.type || "application/octet-stream");
    setStatusMessage("File loaded locally.");
  }

  async function copyText(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setStatusMessage("Copied to clipboard.");
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex w-full items-center rounded-[1rem] border border-border bg-muted/30 p-1">
              {(["encode", "decode"] as const).map((nextMode) => (
                <button
                  key={nextMode}
                  type="button"
                  onClick={() => {
                    setMode(nextMode);
                    setStatusMessage("");
                  }}
                  className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                    mode === nextMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {nextMode === "encode" ? "Encode" : "Decode"}
                </button>
              ))}
            </div>

            {mode === "encode" ? (
              <div className="flex w-full items-center rounded-[1rem] border border-border bg-muted/30 p-1">
                {([
                  ["text", "Text input"],
                  ["file", "File upload"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setInputSource(value);
                      setStatusMessage("");
                    }}
                    className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                      inputSource === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {mode === "encode" && inputSource === "file" ? (
            <div className="space-y-3 rounded-[1.25rem] border border-border bg-background p-4">
              <label
                htmlFor={fileInputId}
                className="flex cursor-pointer flex-col gap-2 rounded-[1rem] border border-dashed border-border bg-card px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft"
              >
                <span className="font-medium text-foreground">Choose a file or image</span>
                <span>Encode local file data into Base64 without sending it to a server.</span>
              </label>
              <input id={fileInputId} type="file" className="sr-only" onChange={handleFileChange} />
              {fileName ? <p className="text-sm text-muted-foreground">Loaded file: {fileName}</p> : null}
            </div>
          ) : null}

          {mode === "encode" && inputSource === "text" ? (
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Enter plain text to encode into Base64."
              className={textareaClass}
            />
          ) : null}

          {mode === "decode" ? (
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste a Base64 string or a full data URL to decode it."
              className={textareaClass}
            />
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">MIME type / prefix</span>
              <input
                type="text"
                value={mimeType}
                onChange={(event) => setMimeType(event.target.value)}
                placeholder="text/plain;charset=utf-8"
                className={inputClass}
              />
              <span className="block text-xs leading-5 text-muted-foreground">
                Useful for data URLs and decoded previews. Common values: `text/plain`, `application/json`, `image/png`.
              </span>
            </label>

            {mode === "encode" ? (
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Output format</span>
                <select
                  value={outputFormat}
                  onChange={(event) => setOutputFormat(event.target.value as Base64OutputFormat)}
                  className={inputClass}
                >
                  <option value="raw">Raw Base64</option>
                  <option value="data-url">Data URL</option>
                  <option value="url-safe">URL-safe Base64</option>
                </select>
                <span className="block text-xs leading-5 text-muted-foreground">
                  Raw for most payloads, Data URL for inline HTML/CSS, URL-safe for transport where `+` and `/` are inconvenient.
                </span>
              </label>
            ) : (
              <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
                Base64 is encoding, not encryption. Decoding restores the original bytes only if the source string is valid.
              </div>
            )}
          </div>

          <textarea
            value={activeOutput}
            readOnly
            placeholder={mode === "encode" ? "Encoded Base64 output appears here." : "Decoded text appears here when the bytes are valid UTF-8 text."}
            className={textareaClass}
          />

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(activeOutput)} className={actionClass}>
              {mode === "encode" ? "Copy output" : "Copy decoded text"}
            </button>
            {mode === "encode" && encodeResult?.rawBase64 ? (
              <>
                <button type="button" onClick={() => copyText(encodeResult.rawBase64)} className={actionClass}>
                  Copy raw Base64
                </button>
                <button type="button" onClick={() => copyText(encodeResult.rawBase64.replace(/=+$/g, ""))} className={actionClass}>
                  Copy without padding
                </button>
                <button type="button" onClick={() => copyText(toDataUrl(encodeResult.rawBase64, mimeType))} className={actionClass}>
                  Copy data URL
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setText("");
                setFileBytes(null);
                setFileName("");
                setStatusMessage("");
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>

        <aside className={`space-y-4 ${panelClass}`}>
          <p className="text-sm text-muted-foreground">
            {getBase64RouteTitle(mode)} text, files, or images in the browser. This tool is useful for API payloads, data URLs, quick debugging, and transport-safe conversion.
          </p>

          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-medium text-foreground">Size insight</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span>Original size</span>
                <span className="font-medium text-foreground">
                  {mode === "encode"
                    ? formatBytes(encodeResult?.originalBytes ?? 0)
                    : formatBytes(decodeResult?.decodedBytes ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{mode === "encode" ? "Encoded size" : "Input Base64 size"}</span>
                <span className="font-medium text-foreground">
                  {mode === "encode"
                    ? formatBytes(encodeResult?.encodedBytes ?? 0)
                    : formatBytes(decodeResult?.encodedBytes ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Approx. overhead</span>
                <span className="font-medium text-foreground">
                  {sizeDelta !== null ? `${sizeDelta.toFixed(0)}%` : "-"}
                </span>
              </div>
            </div>
          </div>

          {mode === "decode" && decodeResult?.dataUrl && decodeResult.mimeType.startsWith("image/") ? (
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">Decoded preview</p>
              <img src={decodeResult.dataUrl} alt="Decoded Base64 preview" className="mt-3 max-h-48 rounded-xl border border-border object-contain" />
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-[1rem] border border-success/20 bg-success-soft p-4 text-sm text-success-soft-foreground">
              {statusMessage}
            </div>
          ) : null}

          {activeError ? (
            <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">
              {activeError}
            </div>
          ) : null}

          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-medium text-foreground">Developer notes</p>
            <ul className="mt-3 space-y-2">
              <li>Base64 is not encryption. It only turns bytes into ASCII text.</li>
              <li>Use Data URLs for small inline assets, not large images.</li>
              <li>URL-safe Base64 replaces `+` and `/` for transport-sensitive contexts.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function ExactConverterToolRunner({ tool }: { tool: ExactConverterTool }) {
  const [text, setText] = useState("");
  const [jsonInputSource, setJsonInputSource] = useState<JsonInputSource>("paste");
  const [jsonUrl, setJsonUrl] = useState("");
  const [jsonSourceError, setJsonSourceError] = useState("");
  const [jsonSourceStatus, setJsonSourceStatus] = useState("");
  const [selectedJsonFile, setSelectedJsonFile] = useState("");
  const [isLoadingJsonUrl, setIsLoadingJsonUrl] = useState(false);
  const jsonFileInputId = useId();
  const isJsonInputTool = tool.family === "data" && tool.from === "json";
  const isBase64Tool =
    tool.family === "encoding" && (tool.mode === "base64-encode" || tool.mode === "base64-decode");

  const result = useMemo(() => {
    if (text.length === 0) {
      return { output: "" };
    }

    if (tool.family === "encoding") {
      return transformEncoding(tool.mode, text);
    }
    if (tool.family === "data") {
      return convertDataFormat(text, tool.from, tool.to);
    }
    if (tool.family === "time") {
      return convertTime(text, tool.mode);
    }
    return convertUnit(text, tool.mode);
  }, [text, tool]);

  const textareaPlaceholder = isJsonInputTool
    ? jsonInputSource === "paste"
      ? "Paste JSON here to convert it."
      : "Loaded JSON appears here and can still be edited before converting."
    : `Enter data for ${tool.name.toLowerCase()}.`;

  async function handleJsonUrlLoad() {
    const trimmedUrl = jsonUrl.trim();

    if (!trimmedUrl) {
      setJsonSourceError("Enter a JSON URL to load.");
      setJsonSourceStatus("");
      return;
    }

    setIsLoadingJsonUrl(true);
    setJsonSourceError("");
    setJsonSourceStatus("");
    setSelectedJsonFile("");

    try {
      const response = await fetch("/api/json-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const body = (await response.json().catch(() => null)) as { json?: string; error?: string } | null;

      if (!response.ok || !body?.json) {
        setJsonSourceError(body?.error || "Unable to load JSON from that URL.");
        setJsonSourceStatus("");
        return;
      }

      setText(body.json);
      setJsonSourceStatus("JSON loaded from URL.");
    } catch {
      setJsonSourceError("Unable to load JSON from that URL right now.");
      setJsonSourceStatus("");
    } finally {
      setIsLoadingJsonUrl(false);
    }
  }

  async function handleJsonFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setJsonSourceError("");
    setJsonSourceStatus("");
    setSelectedJsonFile("");

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const prettyJson = JSON.stringify(parsed, null, 2);

      setText(prettyJson);
      setSelectedJsonFile(`${file.name} (${formatBytes(file.size)})`);
      setJsonSourceStatus("JSON file loaded.");
    } catch {
      setJsonSourceError("That file does not contain valid JSON.");
      setJsonSourceStatus("");
    }
  }

  if (tool.family === "encoding" && (tool.mode === "base64-encode" || tool.mode === "base64-decode")) {
    return <Base64ConverterPanel tool={tool as Base64ConverterTool} />;
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          {isJsonInputTool ? (
            <div className="space-y-4 rounded-[1.25rem] border border-border bg-background p-4">
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "paste", label: "Paste JSON" },
                  { value: "url", label: "JSON URL" },
                  { value: "file", label: "Upload JSON File" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setJsonInputSource(option.value);
                      setJsonSourceError("");
                      setJsonSourceStatus("");
                    }}
                    className={
                      jsonInputSource === option.value
                        ? "rounded-[0.9rem] border border-primary bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
                        : actionClass
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {jsonInputSource === "paste" ? (
                <p className="text-sm leading-6 text-muted-foreground">Paste raw JSON directly into the input area below.</p>
              ) : null}

              {jsonInputSource === "url" ? (
                <div className="space-y-3">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">JSON URL</span>
                    <input
                      type="url"
                      value={jsonUrl}
                      onChange={(event) => setJsonUrl(event.target.value)}
                      placeholder="https://example.com/data.json"
                      className={inputClass}
                    />
                  </label>
                  <button type="button" onClick={handleJsonUrlLoad} disabled={isLoadingJsonUrl} className={actionClass}>
                    {isLoadingJsonUrl ? "Loading JSON" : "Load JSON URL"}
                  </button>
                </div>
              ) : null}

              {jsonInputSource === "file" ? (
                <div className="space-y-3">
                  <label
                    htmlFor={jsonFileInputId}
                    className="flex cursor-pointer flex-col gap-2 rounded-[1rem] border border-dashed border-border bg-card px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft"
                  >
                    <span className="font-medium text-foreground">Choose a `.json` file</span>
                    <span>Upload a local JSON file and load it into the converter.</span>
                  </label>
                  <input id={jsonFileInputId} type="file" accept=".json,application/json,text/json" className="sr-only" onChange={handleJsonFileChange} />
                  {selectedJsonFile ? <p className="text-sm text-muted-foreground">Loaded file: {selectedJsonFile}</p> : null}
                </div>
              ) : null}

              {jsonSourceStatus ? <div className="rounded-[1rem] border border-success/20 bg-success-soft p-3 text-sm text-success-soft-foreground">{jsonSourceStatus}</div> : null}
              {jsonSourceError ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-3 text-sm text-danger">{jsonSourceError}</div> : null}
            </div>
          ) : null}

          <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={textareaPlaceholder} className={textareaClass} />
          <textarea value={result.output || ""} readOnly placeholder="Converted output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output || "")} className={actionClass}>Copy result</button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setJsonSourceError("");
                setJsonSourceStatus("");
                setSelectedJsonFile("");
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
          {isJsonInputTool ? (
            <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
              Use pasted JSON, fetch it from a live URL, or load it from a local file before converting.
            </div>
          ) : null}
          {"error" in result && result.error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{result.error}</div> : null}
        </aside>
      </div>
    </section>
  );
}
