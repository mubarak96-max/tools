"use client";

import { useMemo, useState } from "react";

import { defaultLineToolsOptions, runLineTools } from "@/lib/tools/line-tools";

import { actionClass, inputClass, panelClass, selectClass, textareaClass } from "./shared";

export default function LineTools() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(defaultLineToolsOptions);
  const result = useMemo(() => runLineTools(text, options), [text, options]);

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste lines or words to sort, filter, number, prefix, suffix, reverse, or truncate."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Processed output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output)} className={actionClass}>
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setOptions(defaultLineToolsOptions);
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Scope</span>
              <select
                value={options.scope}
                onChange={(event) => setOptions((current) => ({ ...current, scope: event.target.value as typeof current.scope }))}
                className={selectClass}
              >
                <option value="lines">Lines</option>
                <option value="words">Words</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Sort mode</span>
              <select
                value={options.sortMode}
                onChange={(event) =>
                  setOptions((current) => ({ ...current, sortMode: event.target.value as typeof current.sortMode }))
                }
                className={selectClass}
              >
                <option value="none">None</option>
                <option value="alphabetic">Alphabetic</option>
                <option value="numeric">Numeric</option>
                <option value="length">Length</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Direction</span>
              <select
                value={options.sortDirection}
                onChange={(event) =>
                  setOptions((current) => ({ ...current, sortDirection: event.target.value as typeof current.sortDirection }))
                }
                className={selectClass}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Join delimiter</span>
              <input
                value={options.joinDelimiter}
                onChange={(event) => setOptions((current) => ({ ...current, joinDelimiter: event.target.value }))}
                className={inputClass}
                placeholder="\n or , "
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Filter contains</span>
              <input
                value={options.filterQuery}
                onChange={(event) => setOptions((current) => ({ ...current, filterQuery: event.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Truncate length</span>
              <input
                type="number"
                min="0"
                value={options.truncateLength}
                onChange={(event) => setOptions((current) => ({ ...current, truncateLength: Number(event.target.value) || 0 }))}
                className={inputClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Prefix</span>
              <input value={options.prefix} onChange={(event) => setOptions((current) => ({ ...current, prefix: event.target.value }))} className={inputClass} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Suffix</span>
              <input value={options.suffix} onChange={(event) => setOptions((current) => ({ ...current, suffix: event.target.value }))} className={inputClass} />
            </label>
          </div>
          {[
            ["trimLines", "Trim items"],
            ["removeEmptyLines", "Remove empty items"],
            ["reverseOrder", "Reverse order"],
            ["caseSensitive", "Case-sensitive filter"],
            ["uniqueOnly", "Keep unique only"],
            ["addLineNumbers", "Add numbering"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={options[key as keyof typeof options] as boolean}
                onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>
              Input items: <strong className="text-foreground">{result.inputItems}</strong>
            </p>
            <p className="mt-1">
              Output items: <strong className="text-foreground">{result.outputItems}</strong>
            </p>
            <p className="mt-1">
              Removed: <strong className="text-foreground">{result.removedItems}</strong>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

