"use client";

import { useMemo, useState } from "react";

import type { ExactUtilityTool } from "@/lib/tools/exact-catalog";
import { transformCode } from "@/lib/tools/code-formatters";
import { generateRandom } from "@/lib/tools/random-generators";

import { actionClass, inputClass, panelClass, textareaClass } from "./shared";

export default function ExactUtilityToolRunner({ tool }: { tool: ExactUtilityTool }) {
  const [text, setText] = useState("");
  const [length, setLength] = useState(16);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [items, setItems] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [error, setError] = useState("");

  const output = useMemo(
    () => (tool.family === "random" ? generateRandom(tool.mode, { length, min, max, items }) : codeOutput),
    [codeOutput, items, length, max, min, tool],
  );

  async function handleRunFormatter() {
    if (tool.family !== "code") {
      return;
    }
    const result = await transformCode(tool.language, tool.action, text);
    setCodeOutput(result.output);
    setError(result.error || "");
  }

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          {tool.family === "code" ? (
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={`Paste content into ${tool.name.toLowerCase()}.`} className={textareaClass} />
          ) : tool.mode === "pick-item" ? (
            <textarea value={items} onChange={(event) => setItems(event.target.value)} placeholder="Enter one item per line." className={textareaClass} />
          ) : null}
          <textarea value={output} readOnly placeholder="Output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            {tool.family === "code" ? <button type="button" onClick={handleRunFormatter} className={actionClass}>Run</button> : null}
            <button type="button" onClick={() => navigator.clipboard.writeText(output)} className={actionClass}>Copy result</button>
            <button type="button" onClick={() => { setText(""); setItems(""); setCodeOutput(""); setError(""); }} className={actionClass}>Clear</button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          {tool.family === "random" ? (
            <>
              {tool.mode === "password" || tool.mode === "string" ? <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Length</span><input type="number" min="1" value={length} onChange={(event) => setLength(Number(event.target.value) || 1)} className={inputClass} /></label> : null}
              {tool.mode === "number" ? (
                <>
                  <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Min</span><input type="number" value={min} onChange={(event) => setMin(Number(event.target.value) || 0)} className={inputClass} /></label>
                  <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Max</span><input type="number" value={max} onChange={(event) => setMax(Number(event.target.value) || 0)} className={inputClass} /></label>
                </>
              ) : null}
            </>
          ) : null}
          {error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{error}</div> : null}
        </aside>
      </div>
    </section>
  );
}

