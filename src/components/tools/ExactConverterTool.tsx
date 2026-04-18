"use client";

import { useId, useMemo, useState } from "react";

import { AlertCircle, Code, Copy, Cpu } from "lucide-react";
import { EXACT_CONVERTER_TOOL_MAP, type ExactConverterTool } from "@/lib/tools/exact-catalog";
import { convertDataFormat, exportToExcel, type DataFormat } from "@/lib/tools/data-format-converter";
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

type EncodingTool = ExactConverterTool & { family: "encoding" };

function UrlEncoderPanel({ tool }: { tool: EncodingTool }) {
  const [mode, setMode] = useState<UrlUiMode>(tool.mode === "url-decode" ? "decode" : "encode");
  const [text, setText] = useState("");
  const [plusForSpace, setPlusForSpace] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const result = useMemo(() => {
    const currentMode = mode === "encode" ? "url-encode" : "url-decode";
    return transformEncoding(currentMode as EncodingMode, text, { plusForSpace });
  }, [mode, text, plusForSpace]);

  async function copyText(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setStatusMessage("Copied to clipboard.");
    setTimeout(() => setStatusMessage(""), 2000);
  }

  const inputCharCount = text.length;
  const outputCharCount = result.output.length;

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="flex w-full max-w-xs items-center rounded-[1rem] border border-border bg-muted/30 p-1">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Input</span>
              <span className="text-xs text-muted-foreground">{inputCharCount} characters</span>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={mode === "encode" ? "Paste text to encode..." : "Paste encoded URL string to decode..."}
              className={textareaClass}
              rows={6}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {mode === "encode" && (
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  checked={plusForSpace}
                  onChange={(e) => setPlusForSpace(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary"
                />
                <span>Encode space as `+` (RFC 1738)</span>
              </label>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Result</span>
              <span className="text-xs text-muted-foreground">{outputCharCount} characters</span>
            </div>
            <textarea
              value={result.output}
              readOnly
              placeholder="Output appears here..."
              className={`${textareaClass} bg-muted/20`}
              rows={6}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(result.output)} className={actionClass}>
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setStatusMessage("");
              }}
              className={actionClass}
            >
              Clear
            </button>
            {statusMessage && (
              <span className="flex items-center px-2 text-sm font-medium text-success animate-in fade-in duration-300">
                {statusMessage}
              </span>
            )}
          </div>
        </div>

        <aside className={`space-y-4 ${panelClass}`}>
          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">What is URL Encoding?</p>
            <p className="mt-2">
              Also known as percent-encoding, it converts characters that might have special meaning in a URL into a safe format (e.g., spaces become `%20` or `+`).
            </p>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground font-mono">Code Snippets</p>
            <div className="mt-3 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">JavaScript</p>
                <code className="mt-1 block rounded bg-muted/40 p-2 text-xs text-foreground overflow-x-auto whitespace-pre">
                  {mode === "encode" ? "encodeURIComponent(text)" : "decodeURIComponent(text)"}
                </code>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Python</p>
                <code className="mt-1 block rounded bg-muted/40 p-2 text-xs text-foreground overflow-x-auto whitespace-pre">
                  {mode === "encode" ? "urllib.parse.quote(text)" : "urllib.parse.unquote(text)"}
                </code>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">PHP</p>
                <code className="mt-1 block rounded bg-muted/40 p-2 text-xs text-foreground overflow-x-auto whitespace-pre">
                  {mode === "encode" ? "rawurlencode($text)" : "rawurldecode($text)"}
                </code>
              </div>
            </div>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">Common references</p>
            <table className="mt-3 w-full text-left">
              <thead>
                <tr>
                  <th className="pb-1 text-xs font-medium text-muted-foreground">Char</th>
                  <th className="pb-1 text-xs font-medium text-muted-foreground">Encoded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs tabular-nums">
                <tr><td className="py-1">Space</td><td className="py-1">%20 or +</td></tr>
                <tr><td className="py-1">&amp;</td><td className="py-1">%26</td></tr>
                <tr><td className="py-1">=</td><td className="py-1">%3D</td></tr>
                <tr><td className="py-1">?</td><td className="py-1">%3F</td></tr>
                <tr><td className="py-1">/</td><td className="py-1">%2F</td></tr>
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </section>
  );
}

type DataTool = ExactConverterTool & { family: "data" };

function DataFormatConverterPanel({ tool }: { tool: DataTool }) {
  const fromFormat = (tool.from as DataFormat) || "json";
  const [toFormat, setToFormat] = useState<DataFormat>((tool.to as DataFormat) || "csv");
  const [text, setText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target?.result as string);
        setStatusMessage(`File "${file.name}" uploaded.`);
        setTimeout(() => setStatusMessage(""), 3000);
      };
      reader.readAsText(file);
    }
  };

  const downloadResult = () => {
    const blob = new Blob([result.output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-data.${toFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    const blob = exportToExcel(text, fromFormat);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const result = useMemo(() => {
    if (text.length === 0) return { output: "" };
    return convertDataFormat(text, fromFormat, toFormat);
  }, [text, fromFormat, toFormat]);

  async function copyText(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setStatusMessage("Copied to clipboard.");
    setTimeout(() => setStatusMessage(""), 2000);
  }

  const destinationOptions: DataFormat[] =
    fromFormat === "json"
      ? ["csv", "yaml", "xml", "text"]
      : fromFormat === "csv"
        ? ["json", "xml"]
        : fromFormat === "xml"
          ? ["json", "csv", "yaml", "text"]
          : fromFormat === "yaml"
            ? ["json", "xml"]
            : fromFormat === "markdown"
              ? ["html"]
              : fromFormat === "html"
                ? ["markdown"]
                : [];

  const icons = {
    json: "{}",
    csv: "▦",
    xml: "</>",
    yaml: "⌥",
    text: "T",
    html: "H",
    markdown: "M↓",
  };

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
             <div className="space-y-2">
               <span className="text-sm font-medium text-muted-foreground ml-1">Source Format</span>
               <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-muted/20 text-foreground font-bold">
                  <span className="text-primary text-lg">{icons[fromFormat]}</span>
                  {fromFormat.toUpperCase()}
               </div>
             </div>
             <div className="space-y-2">
               <span className="text-sm font-medium text-muted-foreground ml-1">Destination Format</span>
               <select
                 value={toFormat}
                 onChange={(e) => setToFormat(e.target.value as DataFormat)}
                 className={inputClass}
               >
                 {destinationOptions.map((opt) => (
                   <option key={opt} value={opt}>
                     {opt.toUpperCase()}
                   </option>
                 ))}
               </select>
             </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Source Data</span>
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={`Paste your ${fromFormat.toUpperCase()} content here...`}
              className={textareaClass}
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Converted Output</span>
              <span className="text-xs text-muted-foreground">{result.output.length} characters</span>
            </div>
            <textarea
              value={result.output}
              readOnly
              placeholder="Conversion results will appear here..."
              className={`${textareaClass} bg-muted/20 font-mono`}
              rows={10}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(result.output)} className={actionClass}>
              <Copy size={16} className="mr-1.5" />
              Copy result
            </button>
            <button type="button" onClick={downloadResult} className={actionClass} disabled={!result.output}>
              <Cpu size={16} className="mr-1.5" />
              Download .{toFormat}
            </button>
            {toFormat === "csv" && (
              <button type="button" onClick={downloadExcel} className={actionClass} disabled={!text}>
                <Cpu size={16} className="mr-1.5" />
                Download Excel
              </button>
            )}

            <div className="relative">
              <input type="file" id="data-upload" className="hidden" onChange={handleFileUpload} accept={`.${fromFormat}`} />
              <label htmlFor="data-upload" className={`${actionClass} cursor-pointer`}>
                <Code size={16} className="mr-1.5" />
                Upload File
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setText("");
                setStatusMessage("");
              }}
              className={actionClass}
            >
              Clear
            </button>
            {statusMessage && (
              <span className="flex items-center px-2 text-sm font-medium text-success animate-in fade-in duration-300">
                {statusMessage}
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Code size={16} className="text-primary" /> Technical Profile
            </h3>
            <div className="space-y-4">
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold text-foreground capitalize mb-1">{fromFormat}</p>
                <p className="text-muted-foreground">
                  {fromFormat === "json" && "Standard lightweight data-interchange format. Perfect for APIs and modern web apps."}
                  {fromFormat === "csv" && "Tabular data format. Ideal for importing into spreadsheets like Excel or Google Sheets."}
                  {fromFormat === "xml" && "Extensible markup language. Common in enterprise systems and legacy data exchange."}
                  {fromFormat === "yaml" && "Human-friendly data serialization. Mostly used for configuration files."}
                </p>
              </div>
              <div className="text-[11px] leading-relaxed border-t border-border/10 pt-3">
                <p className="font-bold text-foreground mb-1 italic">Conversion Logic</p>
                <p className="text-muted-foreground">
                   {toFormat === "csv" && "Nested objects will be flattened into column headers using dot notation."}
                   {toFormat === "json" && "Validates source structure before creating a clean, indented JSON object."}
                   {toFormat === "xml" && "Maps object trees to nested XML tags with standard attribute handling."}
                   {toFormat === "yaml" && "Converts complex structures into readable, whitespace-sensitive YAML."}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-primary">
              <AlertCircle size={16} /> Privacy Guard
            </h3>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
               This converter uses <b>local parsing</b>. No data is sent to our servers. All transformations from {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} happen in your browser memory for maximum security.
            </p>
          </div>

          {result.error && (
            <div className="p-4 rounded-[1.25rem] border border-danger/20 bg-danger-soft text-sm text-danger flex gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-[11px] leading-tight font-medium">
                <b>Parsing Error:</b> {result.error}
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function LowLevelEncoderPanel({ tool }: { tool: EncodingTool }) {
  const isBinary = tool.slug === "binary-encoder-decoder";
  const isHex = tool.slug === "hex-encoder-decoder";
  const isOctal = tool.slug === "octal-encoder-decoder";
  const isDecimal = tool.slug === "decimal-encoder-decoder";

  const defaultMode = tool.mode.startsWith("text-to-") ? "encode" : "decode";
  const [mode, setMode] = useState<UrlUiMode>(defaultMode);
  const [text, setText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const result = useMemo(() => {
    if (text.length === 0) return { output: "" };
    const transformMode = mode === "encode" ? tool.mode : tool.mode.replace("text-to-", "").concat("-to-text");
    return transformEncoding(transformMode as EncodingMode, text);
  }, [mode, text, tool.mode]);

  async function copyText(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setStatusMessage("Copied to clipboard.");
    setTimeout(() => setStatusMessage(""), 2000);
  }

  const baseName = isBinary ? "Binary" : isHex ? "Hex" : isOctal ? "Octal" : "Decimal";
  const basePrefix = isHex ? "0x" : isBinary ? "0b" : "";

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="flex w-full max-w-xs items-center rounded-[1rem] border border-border bg-muted/30 p-1">
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
                {nextMode === "encode" ? "Text to " + baseName : baseName + " to Text"}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Input</span>
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={mode === "encode" ? "Paste text to convert..." : `Paste ${baseName.toLowerCase()} values...`}
              className={textareaClass}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Result</span>
              <span className="text-xs text-muted-foreground">{result.output.length} characters</span>
            </div>
            <textarea
              value={result.output}
              readOnly
              placeholder="Output will appear here..."
              className={`${textareaClass} bg-muted/20 font-mono`}
              rows={8}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(result.output)} className={actionClass}>
              <Copy size={16} className="mr-1.5" />
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setStatusMessage("");
              }}
              className={actionClass}
            >
              Clear
            </button>
            {statusMessage && (
              <span className="flex items-center px-2 text-sm font-medium text-success animate-in fade-in duration-300">
                {statusMessage}
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Code size={16} className="text-primary" /> Representation
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool converts characters into their underlying <b>{baseName}</b> values according to the ASCII/Unicode standard.
              {isBinary && " Each character is represented by an 8-bit sequence (e.g., 'A' becomes 01000001)."}
              {isHex && " Hexadecimal is base-16, often used in memory addresses and color codes."}
              {isOctal && " Octal is base-8, historically used in computing where bits were grouped in threes."}
              {isDecimal && " Decimal is base-10, the standard human counting system based on character codes."}
            </p>
          </div>

          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-primary">
              <AlertCircle size={16} /> Technical Tip
            </h3>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {isBinary || isHex ? (
                <>
                  These formats are common in <b>low-level debugging</b> and bitwise operations. When decoding, ensure values are separated by spaces for accurate results.
                </>
              ) : (
                <>
                  Character codes represent the numerical mapping of a character in the Unicode standard. This is the <b>absolute value</b> used by computer systems to identify a glyph.
                </>
              )}
            </p>
          </div>

          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3">Quick Reference</h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-border/10 pb-1">
                <span className="text-muted-foreground">Char: A</span>
                <span className="text-foreground">
                  {isBinary ? "01000001" : isHex ? "41" : isOctal ? "101" : "65"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1">
                <span className="text-muted-foreground">Char: a</span>
                <span className="text-foreground">
                  {isBinary ? "01100001" : isHex ? "61" : isOctal ? "141" : "97"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Char: !</span>
                <span className="text-foreground">
                  {isBinary ? "00100001" : isHex ? "21" : isOctal ? "041" : "33"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

type UrlUiMode = "encode" | "decode";

function HtmlEncoderPanel({ tool }: { tool: EncodingTool }) {
  const [mode, setMode] = useState<UrlUiMode>(tool.mode === "html-decode" ? "decode" : "encode");
  const [text, setText] = useState("");
  const [entityType, setEntityType] = useState<"named" | "decimal" | "hex">("named");
  const [statusMessage, setStatusMessage] = useState("");

  const result = useMemo(() => {
    if (text.length === 0) {
      return { output: "" };
    }
    return transformEncoding(mode === "encode" ? "html-encode" : "html-decode", text, {
      htmlEntityType: entityType,
    });
  }, [mode, text, entityType]);

  async function copyText(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setStatusMessage("Copied to clipboard.");
    setTimeout(() => setStatusMessage(""), 2000);
  }

  const snippets = {
    js:
      mode === "encode"
        ? `const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");`
        : `const textarea = document.createElement("textarea");\ntextarea.innerHTML = escapedText;\nconst decoded = textarea.value;`,
    python:
      mode === "encode"
        ? `import html\nescaped = html.escape(text)`
        : `import html\ndecoded = html.unescape(escaped_text)`,
    php:
      mode === "encode"
        ? `$escaped = htmlspecialchars($text, ENT_QUOTES, 'UTF-8');`
        : `$decoded = htmlspecialchars_decode($escaped_text, ENT_QUOTES);`,
  };

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="flex w-full max-w-xs items-center rounded-[1rem] border border-border bg-muted/30 p-1">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Input</span>
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={mode === "encode" ? "Paste HTML code or text to escape..." : "Paste HTML entities to decode..."}
              className={textareaClass}
              rows={8}
            />
          </div>

          {mode === "encode" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Output Entity Type</label>
              <div className="flex flex-wrap gap-2">
                {(["named", "decimal", "hex"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEntityType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      entityType === type
                        ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Result</span>
              <span className="text-xs text-muted-foreground">{result.output.length} characters</span>
            </div>
            <textarea
              value={result.output}
              readOnly
              placeholder="Output will appear here..."
              className={`${textareaClass} bg-muted/20 font-mono`}
              rows={8}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(result.output)} className={actionClass}>
              <Copy size={16} className="mr-1.5" />
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setStatusMessage("");
              }}
              className={actionClass}
            >
              Clear
            </button>
            {statusMessage && (
              <span className="flex items-center px-2 text-sm font-medium text-success animate-in fade-in duration-300">
                {statusMessage}
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Code size={16} className="text-primary" /> Common Entities
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 p-2 rounded-lg bg-muted/40 font-mono border border-border/10">
                <span className="text-muted-foreground">{"<"}</span>
                <span className="text-foreground text-right">&lt; / &#60;</span>
              </div>
              <div className="grid grid-cols-2 p-2 rounded-lg bg-muted/40 font-mono border border-border/10">
                <span className="text-muted-foreground">{">"}</span>
                <span className="text-foreground text-right">&gt; / &#62;</span>
              </div>
              <div className="grid grid-cols-2 p-2 rounded-lg bg-muted/40 font-mono border border-border/10">
                <span className="text-muted-foreground">{"&"}</span>
                <span className="text-foreground text-right">&amp; / &#38;</span>
              </div>
              <div className="grid grid-cols-2 p-2 rounded-lg bg-muted/40 font-mono border border-border/10">
                <span className="text-muted-foreground">{'"'}</span>
                <span className="text-foreground text-right">&quot; / &#34;</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-primary">
              <AlertCircle size={16} /> Security Tip
            </h3>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Always <b>escape</b> user-provided data before injecting it into HTML attributes or tags. This prevents 
              <b> Cross-Site Scripting (XSS)</b> attacks where malicious code could be executed in the victim's browser.
            </p>
          </div>

          <div className="space-y-3">
             <h3 className="text-sm font-bold px-1 flex items-center gap-2">
               <Cpu size={16} className="text-primary" /> Code Snippets
             </h3>
             <div className="space-y-2">
               {Object.entries(snippets).map(([lang, code]) => (
                 <div key={lang} className="group relative">
                   <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase bg-background/80 px-1.5 py-0.5 rounded border border-border/50">{lang}</span>
                   </div>
                   <pre className="p-3 rounded-xl bg-muted/30 text-[10px] font-mono overflow-x-auto border border-border/50 transition-all group-hover:bg-muted/50 group-hover:border-primary/20 whitespace-pre-wrap">
                     {code}
                   </pre>
                 </div>
               ))}
             </div>
          </div>
        </aside>
      </div>
    </section>
  );
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
    setTimeout(() => setStatusMessage(""), 2000);
  }

  const snippets = {
    js:
      mode === "encode"
        ? `const b64 = btoa(unescape(encodeURIComponent(text)));`
        : `const decoded = decodeURIComponent(escape(atob(b64)));`,
    python:
      mode === "encode"
        ? `import base64\nb64 = base64.b64encode(text.encode('utf-8')).decode('utf-8')`
        : `import base64\ndecoded = base64.b64decode(b64).decode('utf-8')`,
    php:
      mode === "encode"
        ? `$b64 = base64_encode($text);`
        : `$decoded = base64_decode($b64);`,
  };

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Input</span>
              <span className="text-xs text-muted-foreground">
                {mode === "encode" && inputSource === "file" ? fileName : `${text.length} characters`}
              </span>
            </div>
            {mode === "encode" && inputSource === "file" ? (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-card/50 p-1">
                <label
                  htmlFor={fileInputId}
                  className="flex cursor-pointer flex-col items-center gap-3 px-4 py-12 text-center text-sm text-muted-foreground transition-all hover:bg-primary-soft rounded-[1rem]"
                >
                  <Cpu size={32} className="text-primary/40" />
                  <div>
                    <span className="font-bold text-foreground block">Click to upload file</span>
                    <span className="text-xs mt-1 block">Local processing — no data is sent to servers.</span>
                  </div>
                </label>
                <input id={fileInputId} type="file" className="sr-only" onChange={handleFileChange} />
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={mode === "encode" ? "Enter plain text to encode..." : "Paste Base64 string to decode..."}
                className={textareaClass}
                rows={8}
              />
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground ml-1">MIME Type / Prefix</span>
              <input
                type="text"
                value={mimeType}
                onChange={(event) => setMimeType(event.target.value)}
                placeholder="text/plain"
                className={inputClass}
              />
            </label>

            {mode === "encode" ? (
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground ml-1">Output Format</span>
                <select
                  value={outputFormat}
                  onChange={(event) => setOutputFormat(event.target.value as Base64OutputFormat)}
                  className={inputClass}
                >
                  <option value="raw">Raw Base64</option>
                  <option value="data-url">Data URL</option>
                  <option value="url-safe">URL-safe</option>
                </select>
              </label>
            ) : (
              <div className="flex items-end h-full pb-1">
                 <p className="text-[11px] text-muted-foreground leading-tight italic">
                   Supports decoding standard, URL-safe, and data URLs automatically.
                 </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-muted-foreground">Result</span>
              <span className="text-xs text-muted-foreground">{activeOutput.length} characters</span>
            </div>
            <textarea
              value={activeOutput}
              readOnly
              placeholder="Output will appear here..."
              className={`${textareaClass} bg-muted/20 font-mono`}
              rows={8}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copyText(activeOutput)} className={actionClass}>
              <Copy size={16} className="mr-1.5" />
              Copy result
            </button>
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
            {statusMessage && (
              <span className="flex items-center px-2 text-sm font-medium text-success animate-in fade-in duration-300">
                {statusMessage}
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-primary" /> Size Insight
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Original</span>
                <span className="font-mono font-bold text-foreground">
                  {mode === "encode"
                    ? formatBytes(encodeResult?.originalBytes ?? 0)
                    : formatBytes(decodeResult?.decodedBytes ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/10 pt-2">
                <span className="text-muted-foreground">Encoded</span>
                <span className="font-mono font-bold text-foreground">
                  {mode === "encode"
                    ? formatBytes(encodeResult?.encodedBytes ?? 0)
                    : formatBytes(decodeResult?.encodedBytes ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/10 pt-2">
                <span className="text-muted-foreground">Overhead</span>
                <span className={`font-mono font-bold ${sizeDelta && sizeDelta > 0 ? "text-warning" : "text-foreground"}`}>
                  {sizeDelta !== null ? `+${sizeDelta.toFixed(1)}%` : "-"}
                </span>
              </div>
            </div>
          </div>

          {mode === "decode" && decodeResult?.dataUrl && decodeResult.mimeType.startsWith("image/") ? (
            <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
              <h3 className="text-sm font-bold mb-3">Decoded Preview</h3>
              <div className="rounded-xl overflow-hidden border border-border bg-muted/20">
                <img src={decodeResult.dataUrl} alt="Base64 Preview" className="max-w-full h-auto object-contain mx-auto" />
              </div>
              <p className="text-[10px] mt-2 text-center text-muted-foreground uppercase font-bold tracking-wider">
                {decodeResult.mimeType}
              </p>
            </div>
          ) : null}

          {activeError ? (
            <div className="p-4 rounded-[1.25rem] border border-danger/20 bg-danger-soft text-sm text-danger flex gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <p>{activeError}</p>
            </div>
          ) : null}

          <div className="space-y-3">
             <h3 className="text-sm font-bold px-1 flex items-center gap-2">
               <Cpu size={16} className="text-primary" /> Code Snippets
             </h3>
             <div className="space-y-2">
               {Object.entries(snippets).map(([lang, code]) => (
                 <div key={lang} className="group relative">
                   <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase bg-background/80 px-1.5 py-0.5 rounded border border-border/50">{lang}</span>
                   </div>
                   <pre className="p-3 rounded-xl bg-muted/30 text-[10px] font-mono overflow-x-auto border border-border/50 transition-all group-hover:bg-muted/50 group-hover:border-primary/20 whitespace-pre-wrap">
                     {code}
                   </pre>
                 </div>
               ))}
             </div>
          </div>

          <div className={`p-4 rounded-[1.25rem] border border-border bg-card/50 ${panelClass}`}>
            <h3 className="text-sm font-bold mb-3">Quick Example</h3>
            <div className="space-y-2 font-mono text-[10px]">
              <div className="p-2 rounded bg-muted/30 border border-border/50">
                 <span className="text-muted-foreground block mb-1 uppercase tracking-tighter">Plain:</span>
                 <span className="text-foreground">Hello World</span>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border/50">
                 <span className="text-muted-foreground block mb-1 uppercase tracking-tighter">Base64:</span>
                 <span className="text-foreground whitespace-pre-wrap break-all">SGVsbG8gV29ybGQ=</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function ExactConverterToolRunner({ slug }: { slug: string }) {
  const tool = EXACT_CONVERTER_TOOL_MAP[slug];
  if (!tool) return null;
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
  const isUrlTool =
    tool.family === "encoding" && (tool.mode === "url-encode" || tool.mode === "url-decode");
  const isHtmlTool =
    tool.family === "encoding" && (tool.mode === "html-encode" || tool.mode === "html-decode");
  const isLowLevelTool = [
    "convert-binary-encoder-decoder",
    "convert-hex-encoder-decoder",
    "convert-octal-encoder-decoder",
    "convert-decimal-encoder-decoder",
  ].includes(tool.slug);

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

  if ("customRunner" in tool && tool.customRunner) {
    const CustomRunner = tool.customRunner;
    return <CustomRunner tool={tool} />;
  }

  if (isBase64Tool) {
    return <Base64ConverterPanel tool={tool as Base64ConverterTool} />;
  }

  if (isUrlTool) {
    return <UrlEncoderPanel tool={tool as EncodingTool} />;
  }

  if (isHtmlTool) {
    return <HtmlEncoderPanel tool={tool as EncodingTool} />;
  }

  if (isLowLevelTool) {
    return <LowLevelEncoderPanel tool={tool as EncodingTool} />;
  }

  if (tool.family === "data") {
    return <DataFormatConverterPanel tool={tool as DataTool} />;
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
