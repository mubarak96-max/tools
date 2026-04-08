"use client";

import { useState } from "react";

import { transformCode, type CodeAction, type CodeLanguage } from "@/lib/tools/code-formatters";

import { actionClass, panelClass, selectClass, textareaClass } from "./shared";

export default function CodeFormatters() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<CodeLanguage>("json");
  const [action, setAction] = useState<CodeAction>("prettify");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function handleRun() {
    const result = await transformCode(language, action, text);
    setOutput(result.output);
    setError(result.error || "");
  }

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste JSON, JavaScript, HTML, CSS, or XML to prettify, minify, or validate it."
            className={textareaClass}
          />
          <textarea value={output} readOnly placeholder="Formatter output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleRun} className={actionClass}>
              Run
            </button>
            <button type="button" onClick={() => navigator.clipboard.writeText(output)} className={actionClass}>
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setOutput("");
                setError("");
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as CodeLanguage)} className={selectClass}>
              <option value="json">JSON</option>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="xml">XML</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Action</span>
            <select value={action} onChange={(event) => setAction(event.target.value as CodeAction)} className={selectClass}>
              <option value="prettify">Prettify</option>
              <option value="minify">Minify</option>
              <option value="validate">Validate</option>
            </select>
          </label>
          {error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{error}</div> : null}
        </aside>
      </div>
    </section>
  );
}
