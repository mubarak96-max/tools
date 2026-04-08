"use client";

import { useMemo, useState } from "react";

import type { ExactTextTool } from "@/lib/tools/exact-catalog";
import { alignText } from "@/lib/tools/text-aligner";
import { cleanText } from "@/lib/tools/text-cleaner";
import { extractValues } from "@/lib/tools/text-extractors";
import { defaultLineToolsOptions, runLineTools } from "@/lib/tools/line-tools";
import { runRegexExtract, runRegexReplace } from "@/lib/tools/regex-tools";
import { calculateTextStatistics } from "@/lib/tools/text-statistics";

import { actionClass, inputClass, panelClass, textareaClass } from "./shared";

export default function ExactTextToolRunner({ tool }: { tool: ExactTextTool }) {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [truncateLength, setTruncateLength] = useState(40);
  const [joinDelimiter, setJoinDelimiter] = useState("\\n");
  const [width, setWidth] = useState(40);
  const [padCharacter, setPadCharacter] = useState(" ");
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [replacement, setReplacement] = useState("");
  const [phraseLength, setPhraseLength] = useState(2);

  const cleanerResult = useMemo(
    () =>
      tool.family === "cleaner"
        ? cleanText(text, {
            trimLines: false,
            removeEmptyLines: false,
            collapseSpaces: false,
            removeAllWhitespace: false,
            removePunctuation: false,
            removeAccents: false,
            whitespaceMode: "none",
            backslashMode: "none",
            ...tool.preset,
          })
        : null,
    [text, tool],
  );

  const lineResult = useMemo(
    () =>
      tool.family === "line"
        ? runLineTools(text, {
            ...defaultLineToolsOptions,
            ...tool.preset,
            sortDirection: direction,
            prefix,
            suffix,
            filterQuery,
            truncateLength,
            joinDelimiter,
          })
        : null,
    [direction, filterQuery, joinDelimiter, prefix, suffix, text, tool, truncateLength],
  );

  const alignResult = useMemo(
    () => (tool.family === "align" ? alignText(text, tool.mode, width, padCharacter || " ") : null),
    [padCharacter, text, tool, width],
  );

  const extractorResult = useMemo(
    () => (tool.family === "extractor" ? extractValues(text, tool.mode, true) : null),
    [text, tool],
  );

  const regexResult = useMemo(
    () =>
      tool.family === "regex"
        ? tool.mode === "extract"
          ? runRegexExtract(text, pattern, flags)
          : runRegexReplace(text, pattern, flags, replacement)
        : null,
    [flags, pattern, replacement, text, tool],
  );

  const statsResult = useMemo(
    () => (tool.family === "stats" ? calculateTextStatistics(text, phraseLength) : null),
    [phraseLength, text, tool],
  );

  const outputValue =
    tool.family === "stats" && statsResult
      ? tool.focus === "longest"
        ? statsResult.longestLine
        : tool.focus === "shortest"
          ? statsResult.shortestLine
          : tool.focus === "phrases"
            ? statsResult.phraseFrequency.map((item) => `${item.value}: ${item.count}`).join("\n")
            : JSON.stringify(
                {
                  characters: statsResult.characters,
                  words: statsResult.words,
                  lines: statsResult.lines,
                  paragraphs: statsResult.paragraphs,
                  longestLine: statsResult.longestLine,
                  shortestLine: statsResult.shortestLine,
                },
                null,
                2,
              )
      : cleanerResult?.output || lineResult?.output || alignResult?.output || extractorResult?.output || regexResult?.output || "";

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={`Paste text into ${tool.name.toLowerCase()}.`} className={textareaClass} />
          <textarea value={outputValue || ""} readOnly placeholder="Output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(outputValue || "")} className={actionClass}>Copy result</button>
            <button type="button" onClick={() => setText("")} className={actionClass}>Clear</button>
          </div>
        </div>

        <aside className={`space-y-4 ${panelClass}`}>
          {tool.family === "line" && tool.focus === "sort" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Direction</span>
              <select value={direction} onChange={(event) => setDirection(event.target.value as typeof direction)} className={inputClass}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          ) : null}
          {tool.family === "line" && (tool.focus === "prefix" || tool.focus === "prefix-suffix") ? (
            <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Prefix</span><input value={prefix} onChange={(event) => setPrefix(event.target.value)} className={inputClass} /></label>
          ) : null}
          {tool.family === "line" && (tool.focus === "suffix" || tool.focus === "prefix-suffix") ? (
            <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Suffix</span><input value={suffix} onChange={(event) => setSuffix(event.target.value)} className={inputClass} /></label>
          ) : null}
          {tool.family === "line" && tool.focus === "filter" ? (
            <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Keep lines containing</span><input value={filterQuery} onChange={(event) => setFilterQuery(event.target.value)} className={inputClass} /></label>
          ) : null}
          {tool.family === "line" && tool.focus === "truncate" ? (
            <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Max length</span><input type="number" min="1" value={truncateLength} onChange={(event) => setTruncateLength(Number(event.target.value) || 1)} className={inputClass} /></label>
          ) : null}
          {tool.family === "line" && tool.focus === "join" ? (
            <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Join delimiter</span><input value={joinDelimiter} onChange={(event) => setJoinDelimiter(event.target.value)} className={inputClass} /></label>
          ) : null}
          {tool.family === "align" ? (
            <>
              <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Line width</span><input type="number" min="1" value={width} onChange={(event) => setWidth(Number(event.target.value) || 1)} className={inputClass} /></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Pad character</span><input value={padCharacter} maxLength={1} onChange={(event) => setPadCharacter(event.target.value.slice(0, 1) || " ")} className={inputClass} /></label>
            </>
          ) : null}
          {tool.family === "regex" ? (
            <>
              <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Pattern</span><input value={pattern} onChange={(event) => setPattern(event.target.value)} className={inputClass} /></label>
              <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Flags</span><input value={flags} onChange={(event) => setFlags(event.target.value)} className={inputClass} /></label>
              {tool.mode === "replace" ? <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Replacement</span><input value={replacement} onChange={(event) => setReplacement(event.target.value)} className={inputClass} /></label> : null}
            </>
          ) : null}
          {tool.family === "stats" && tool.focus === "phrases" ? (
            <label className="block space-y-2"><span className="text-sm font-medium text-muted-foreground">Phrase length</span><input type="number" min="2" max="5" value={phraseLength} onChange={(event) => setPhraseLength(Number(event.target.value) || 2)} className={inputClass} /></label>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
