"use client";

import { useMemo, useState } from "react";

import { transformEncoding, type EncodingMode } from "@/lib/tools/encoding-tools";

import { actionClass, panelClass, selectClass, textareaClass } from "./shared";

const modes: Array<{ value: EncodingMode; label: string }> = [
  { value: "url-encode", label: "URL Encode" },
  { value: "url-decode", label: "URL Decode" },
  { value: "html-encode", label: "HTML Encode" },
  { value: "html-decode", label: "HTML Decode" },
  { value: "base64-encode", label: "Base64 Encode" },
  { value: "base64-decode", label: "Base64 Decode" },
  { value: "rot13", label: "ROT13" },
  { value: "rot47", label: "ROT47" },
  { value: "text-to-binary", label: "Text to Binary" },
  { value: "binary-to-text", label: "Binary to Text" },
  { value: "text-to-hex", label: "Text to Hex" },
  { value: "hex-to-text", label: "Hex to Text" },
  { value: "text-to-octal", label: "Text to Octal" },
  { value: "octal-to-text", label: "Octal to Text" },
  { value: "text-to-decimal", label: "Text to Decimal" },
  { value: "decimal-to-text", label: "Decimal to Text" },
  { value: "punycode-encode", label: "Punycode Encode" },
  { value: "punycode-decode", label: "Punycode Decode" },
  { value: "idn-encode", label: "IDN Encode" },
  { value: "idn-decode", label: "IDN Decode" },
];

export default function EncodingTools() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<EncodingMode>("url-encode");
  const result = useMemo(() => transformEncoding(mode, text), [mode, text]);

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste text or encoded data to convert between common encoding formats."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Converted output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output)} className={actionClass}>
              Copy result
            </button>
            <button type="button" onClick={() => setText("")} className={actionClass}>
              Clear
            </button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Conversion mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as EncodingMode)} className={selectClass}>
              {modes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {result.error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{result.error}</div> : null}
        </aside>
      </div>
    </section>
  );
}

