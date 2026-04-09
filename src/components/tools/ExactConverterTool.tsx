"use client";

import { useId, useMemo, useState } from "react";

import type { ExactConverterTool } from "@/lib/tools/exact-catalog";
import { convertDataFormat } from "@/lib/tools/data-format-converter";
import { transformEncoding } from "@/lib/tools/encoding-tools";
import { convertTime } from "@/lib/tools/time-converter";
import { convertUnit } from "@/lib/tools/unit-converter";

import { actionClass, inputClass, panelClass, textareaClass } from "./shared";

type JsonInputSource = "paste" | "url" | "file";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
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
                <p className="text-sm leading-6 text-muted-foreground">
                  Paste raw JSON directly into the input area below.
                </p>
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


