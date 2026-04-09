"use client";

import { useMemo, useState } from "react";

import { cleanText, defaultTextCleanerOptions } from "@/lib/tools/text-cleaner";

import { actionClass, panelClass, selectClass, textareaClass } from "./shared";

export default function TextCleaner({
  preset = {},
  lockedKeys = [],
  hiddenKeys = [],
}: {
  preset?: Partial<typeof defaultTextCleanerOptions>;
  lockedKeys?: Array<keyof typeof defaultTextCleanerOptions>;
  hiddenKeys?: Array<"whitespaceMode" | "backslashMode" | keyof typeof defaultTextCleanerOptions>;
}) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState({ ...defaultTextCleanerOptions, ...preset });
  const effectiveOptions = useMemo(() => ({ ...options, ...preset }), [options, preset]);
  const result = useMemo(() => cleanText(text, effectiveOptions), [text, effectiveOptions]);
  const isHidden = (key: string) => hiddenKeys.includes(key as never);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste text to trim, normalize, clean punctuation, or adjust whitespace."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Cleaned text appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output)} className={actionClass}>
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setOptions({ ...defaultTextCleanerOptions, ...preset });
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>

        <aside className={`space-y-4 ${panelClass}`}>
          {!isHidden("whitespaceMode") ? (
            <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Whitespace mode</span>
            <select
              value={effectiveOptions.whitespaceMode}
              onChange={(event) =>
                lockedKeys.includes("whitespaceMode")
                  ? undefined
                  : setOptions((current) => ({ ...current, whitespaceMode: event.target.value as typeof current.whitespaceMode }))
              }
              className={selectClass}
              disabled={lockedKeys.includes("whitespaceMode")}
            >
              <option value="none">None</option>
              <option value="spaces-to-tabs">Spaces to tabs</option>
              <option value="tabs-to-spaces">Tabs to spaces</option>
              <option value="spaces-to-newlines">Spaces to newlines</option>
              <option value="newlines-to-spaces">Newlines to spaces</option>
            </select>
            </label>
          ) : null}
          {!isHidden("backslashMode") ? (
            <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Backslash mode</span>
            <select
              value={effectiveOptions.backslashMode}
              onChange={(event) =>
                lockedKeys.includes("backslashMode")
                  ? undefined
                  : setOptions((current) => ({ ...current, backslashMode: event.target.value as typeof current.backslashMode }))
              }
              className={selectClass}
              disabled={lockedKeys.includes("backslashMode")}
            >
              <option value="none">None</option>
              <option value="add">Add backslashes</option>
              <option value="remove">Remove backslashes</option>
            </select>
            </label>
          ) : null}
          {[
            ["trimLines", "Trim each line"],
            ["removeEmptyLines", "Remove empty lines"],
            ["collapseSpaces", "Collapse repeated spaces"],
            ["removeAllWhitespace", "Remove all whitespace"],
            ["removePunctuation", "Remove punctuation"],
            ["removeAccents", "Remove character accents"],
          ].filter(([key]) => !isHidden(key)).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={effectiveOptions[key as keyof typeof effectiveOptions] as boolean}
                onChange={(event) =>
                  lockedKeys.includes(key as keyof typeof defaultTextCleanerOptions)
                    ? undefined
                    : setOptions((current) => ({ ...current, [key]: event.target.checked }))
                }
                disabled={lockedKeys.includes(key as keyof typeof defaultTextCleanerOptions)}
              />
              <span>{label}</span>
            </label>
          ))}

          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>
              Original length: <strong className="text-foreground">{result.originalLength}</strong>
            </p>
            <p className="mt-1">
              Cleaned length: <strong className="text-foreground">{result.cleanedLength}</strong>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


