"use client";

import { useMemo, useState } from "react";

import type { ExactConverterTool } from "@/lib/tools/exact-catalog";
import { convertDataFormat } from "@/lib/tools/data-format-converter";
import { transformEncoding } from "@/lib/tools/encoding-tools";
import { convertTime } from "@/lib/tools/time-converter";
import { convertUnit } from "@/lib/tools/unit-converter";

import { actionClass, panelClass, textareaClass } from "./shared";

export default function ExactConverterToolRunner({ tool }: { tool: ExactConverterTool }) {
  const [text, setText] = useState("");
  const result = useMemo(() => {
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

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={`Enter data for ${tool.name.toLowerCase()}.`} className={textareaClass} />
          <textarea value={result.output || ""} readOnly placeholder="Converted output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output || "")} className={actionClass}>Copy result</button>
            <button type="button" onClick={() => setText("")} className={actionClass}>Clear</button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
          {"error" in result && result.error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{result.error}</div> : null}
        </aside>
      </div>
    </section>
  );
}
