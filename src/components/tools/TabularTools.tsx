"use client";

import { useMemo, useState } from "react";

import { transformTable, type TabularMode } from "@/lib/tools/tabular-tools";

import { inputClass, panelClass, selectClass, textareaClass } from "./shared";

export default function TabularTools() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<TabularMode>("transpose");
  const [delimiter, setDelimiter] = useState(",");
  const [outputDelimiter, setOutputDelimiter] = useState(",");
  const [columnIndex, setColumnIndex] = useState(0);
  const [replacementValue, setReplacementValue] = useState("");
  const [insertValue, setInsertValue] = useState("");
  const result = useMemo(
    () => transformTable(text, { mode, delimiter, outputDelimiter, columnIndex, replacementValue, insertValue }),
    [columnIndex, delimiter, insertValue, mode, outputDelimiter, replacementValue, text],
  );

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste CSV, TSV, or other delimited rows to transpose, export columns, replace columns, or change delimiters."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Converted table output appears here." className={textareaClass} />
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as TabularMode)} className={selectClass}>
              <option value="transpose">Transpose</option>
              <option value="columns-to-rows">Columns to rows</option>
              <option value="rows-to-columns">Rows to columns</option>
              <option value="column-export">Export column</option>
              <option value="column-delete">Delete column</option>
              <option value="column-replace">Replace column</option>
              <option value="column-insert">Insert column</option>
              <option value="delimiter-change">Change delimiter</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Input delimiter</span>
            <input value={delimiter} onChange={(event) => setDelimiter(event.target.value || ",")} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Output delimiter</span>
            <input value={outputDelimiter} onChange={(event) => setOutputDelimiter(event.target.value || ",")} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Column index</span>
            <input type="number" min="0" value={columnIndex} onChange={(event) => setColumnIndex(Number(event.target.value) || 0)} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Replacement value</span>
            <input value={replacementValue} onChange={(event) => setReplacementValue(event.target.value)} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Insert value</span>
            <input value={insertValue} onChange={(event) => setInsertValue(event.target.value)} className={inputClass} />
          </label>
          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>
              Rows: <strong className="text-foreground">{result.rowCount}</strong>
            </p>
            <p className="mt-1">
              Columns: <strong className="text-foreground">{result.columnCount}</strong>
            </p>
            {result.error ? <p className="mt-2 text-danger">{result.error}</p> : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

