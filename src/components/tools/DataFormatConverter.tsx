"use client";

import { useMemo, useState } from "react";

import { convertDataFormat, type DataFormat } from "@/lib/tools/data-format-converter";

import { actionClass, panelClass, selectClass, textareaClass } from "./shared";

const formats: DataFormat[] = ["json", "yaml", "xml", "csv", "text", "html", "markdown"];

export default function DataFormatConverter() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState<DataFormat>("json");
  const [to, setTo] = useState<DataFormat>("yaml");
  const result = useMemo(() => convertDataFormat(text, from, to), [from, text, to]);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste structured data or markup to convert between JSON, YAML, XML, CSV, HTML, Markdown, and text."
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
            <span className="text-sm font-medium text-muted-foreground">From</span>
            <select value={from} onChange={(event) => setFrom(event.target.value as DataFormat)} className={selectClass}>
              {formats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">To</span>
            <select value={to} onChange={(event) => setTo(event.target.value as DataFormat)} className={selectClass}>
              {formats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
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


