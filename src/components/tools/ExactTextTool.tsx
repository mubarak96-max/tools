"use client";

import { useMemo, useState } from "react";

import type { ExactTextTool } from "@/lib/tools/exact-catalog";
import { alignText } from "@/lib/tools/text-aligner";
import { searchCharacterTable, type CharacterTableScope } from "@/lib/tools/character-table";
import { calculateCharacterFrequency } from "@/lib/tools/character-frequency";
import { cleanText } from "@/lib/tools/text-cleaner";
import { compareText, type DiffSegment } from "@/lib/tools/text-diff";
import { extractValues } from "@/lib/tools/text-extractors";
import { defaultLineToolsOptions, runLineTools } from "@/lib/tools/line-tools";
import { generateLoremIpsum } from "@/lib/tools/lorem";
import { calculateReadability } from "@/lib/tools/readability";
import { runRegexExtract, runRegexReplace } from "@/lib/tools/regex-tools";
import { convertTextAndList, type ListDirection } from "@/lib/tools/text-list";
import { calculateTextStatistics } from "@/lib/tools/text-statistics";
import { convertTextToSlug } from "@/lib/tools/text-slug";
import {
  generateFancyFont,
  generateInvisibleText,
  generateTinyText,
  generateUpsideDownText,
  type FancyFontStyle,
  type InvisibleCharacterMode,
  type InvisibleTextResult,
} from "@/lib/tools/unicode-text";
import { generateZalgoText, type ZalgoIntensity, type ZalgoPosition } from "@/lib/tools/zalgo-text";

import { actionClass, inputClass, panelClass, selectClass, textareaClass } from "./shared";

function renderDiffSegments(segments: DiffSegment[] | undefined, type: "left" | "right") {
  if (!segments?.length) {
    return <span className="text-muted-foreground">No content</span>;
  }

  return segments.map((segment, index) => {
    const className =
      segment.type === "same"
        ? ""
        : segment.type === "remove" || type === "left"
          ? "bg-danger-soft text-danger"
          : "bg-primary-soft text-primary";

    return (
      <span key={`${segment.type}-${index}`} className={className}>
        {segment.value}
      </span>
    );
  });
}

export default function ExactTextToolRunner({ tool }: { tool: ExactTextTool }) {
  const [text, setText] = useState("");
  const [comparisonText, setComparisonText] = useState("");
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
  const [slugSeparator, setSlugSeparator] = useState("-");
  const [slugLowercase, setSlugLowercase] = useState(true);
  const [loremAmount, setLoremAmount] = useState(3);
  const [loremUnit, setLoremUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [loremSeed, setLoremSeed] = useState(0);
  const [showUnchangedRows, setShowUnchangedRows] = useState(false);
  const [fancyStyle, setFancyStyle] = useState<FancyFontStyle>("bold");
  const [invisibleMode, setInvisibleMode] = useState<InvisibleCharacterMode>("zero-width-space");
  const [invisibleCount, setInvisibleCount] = useState(1);
  const [listDirection, setListDirection] = useState<ListDirection>("text-to-list");
  const [listDelimiter, setListDelimiter] = useState(",");
  const [listTrimItems, setListTrimItems] = useState(true);
  const [listIgnoreEmpty, setListIgnoreEmpty] = useState(true);
  const [frequencyCaseSensitive, setFrequencyCaseSensitive] = useState(false);
  const [frequencyIncludeWhitespace, setFrequencyIncludeWhitespace] = useState(false);
  const [zalgoIntensity, setZalgoIntensity] = useState<ZalgoIntensity>("medium");
  const [zalgoPosition, setZalgoPosition] = useState<ZalgoPosition>("all");
  const [tableQuery, setTableQuery] = useState("");
  const [tableScope, setTableScope] = useState<CharacterTableScope>("all");

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
    () => (tool.family === "stats" && tool.focus !== "readability" ? calculateTextStatistics(text, phraseLength) : null),
    [phraseLength, text, tool],
  );

  const readabilityResult = useMemo(
    () => (tool.family === "stats" && tool.focus === "readability" ? calculateReadability(text) : null),
    [text, tool],
  );

  const slugResult = useMemo(
    () =>
      tool.family === "transform"
        ? tool.mode === "slug"
          ? convertTextToSlug(text, { separator: slugSeparator, lowercase: slugLowercase })
          : convertTextAndList(text, {
              direction: listDirection,
              delimiter: listDelimiter,
              trimItems: listTrimItems,
              ignoreEmpty: listIgnoreEmpty,
            })
        : "",
    [listDelimiter, listDirection, listIgnoreEmpty, listTrimItems, slugLowercase, slugSeparator, text, tool],
  );

  const loremResult = useMemo(
    () =>
      tool.family === "generator"
        ? generateLoremIpsum({
            amount: loremAmount,
            unit: loremUnit,
            startWithLorem,
            seed: loremSeed,
          })
        : "",
    [loremAmount, loremSeed, loremUnit, startWithLorem, tool],
  );

  const diffResult = useMemo(
    () => (tool.family === "compare" ? compareText(text, comparisonText) : null),
    [comparisonText, text, tool],
  );

  const unicodeResult = useMemo(() => {
    if (tool.family !== "unicode") {
      return null;
    }

    switch (tool.mode) {
      case "fancy-font":
        return { output: generateFancyFont(text, fancyStyle).output };
      case "upside-down":
        return { output: generateUpsideDownText(text) };
      case "tiny-text":
        return { output: generateTinyText(text) };
      case "invisible":
        return generateInvisibleText(invisibleMode, invisibleCount);
      case "zalgo":
        return { output: generateZalgoText(text, zalgoIntensity, zalgoPosition) };
      default:
        return null;
    }
  }, [fancyStyle, invisibleCount, invisibleMode, text, tool, zalgoIntensity, zalgoPosition]);

  const characterFrequencyResult = useMemo(
    () =>
      tool.family === "stats" && tool.focus === "characters"
        ? calculateCharacterFrequency(text, {
            caseSensitive: frequencyCaseSensitive,
            includeWhitespace: frequencyIncludeWhitespace,
          })
        : null,
    [frequencyCaseSensitive, frequencyIncludeWhitespace, text, tool],
  );

  const characterTableResults = useMemo(
    () => (tool.family === "reference" ? searchCharacterTable(tableQuery, tableScope).slice(0, 120) : []),
    [tableQuery, tableScope, tool],
  );

  const invisibleResult: InvisibleTextResult | null =
    tool.family === "unicode" && tool.mode === "invisible" ? (unicodeResult as InvisibleTextResult) : null;

  const readabilityOutput = readabilityResult
    ? [
        `Flesch Reading Ease: ${readabilityResult.fleschReadingEase.toFixed(1)} (${readabilityResult.fleschReadingEaseLabel})`,
        `Flesch-Kincaid Grade: ${readabilityResult.fleschKincaidGrade.toFixed(1)} (${readabilityResult.fleschKincaidGradeLabel})`,
        `Words: ${readabilityResult.words}`,
        `Sentences: ${readabilityResult.sentences}`,
        `Characters (no spaces): ${readabilityResult.characters}`,
        `Syllables: ${readabilityResult.syllables}`,
        `Average Words per Sentence: ${readabilityResult.averageWordsPerSentence.toFixed(1)}`,
        `Average Syllables per Word: ${readabilityResult.averageSyllablesPerWord.toFixed(2)}`,
        `Estimated Reading Time: ${Math.max(readabilityResult.readingTimeMinutes, 0).toFixed(2)} minutes`,
      ].join("\n")
    : "";

  const characterFrequencyOutput = characterFrequencyResult
    ? characterFrequencyResult.entries
        .map((entry) => `${entry.label} (${entry.codepoint}): ${entry.count}`)
        .join("\n")
    : "";

  const outputValue =
    tool.family === "stats" && statsResult
      ? tool.focus === "longest"
        ? statsResult.longestLine
        : tool.focus === "shortest"
          ? statsResult.shortestLine
          : tool.focus === "phrases"
            ? statsResult.phraseFrequency.map((item) => `${item.value}: ${item.count}`).join("\n")
            : tool.focus === "characters"
              ? characterFrequencyOutput
            : JSON.stringify(
                {
                  characters: statsResult.characters,
                  words: statsResult.words,
                  lines: statsResult.lines,
                  paragraphs: statsResult.paragraphs,
                  longestLine: statsResult.longestLine,
                  shortestLine: statsResult.shortestLine,
                  letterFrequency: statsResult.letterFrequency,
                },
                null,
                2,
              )
      : readabilityOutput || unicodeResult?.output || slugResult || loremResult || cleanerResult?.output || lineResult?.output || alignResult?.output || extractorResult?.output || regexResult?.output || "";

  if (tool.family === "compare") {
    const visibleRows = diffResult?.rows.filter((row) => showUnchangedRows || row.type !== "same") ?? [];

    return (
      <section className="tool-frame p-4 sm:p-6">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Original text</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste the original version here."
                className={textareaClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Revised text</span>
              <textarea
                value={comparisonText}
                onChange={(event) => setComparisonText(event.target.value)}
                placeholder="Paste the revised version here."
                className={textareaClass}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(comparisonText)} className={actionClass}>
              Copy revised text
            </button>
            <button type="button" onClick={() => { const current = text; setText(comparisonText); setComparisonText(current); }} className={actionClass}>
              Swap sides
            </button>
            <button type="button" onClick={() => setShowUnchangedRows((value) => !value)} className={actionClass}>
              {showUnchangedRows ? "Hide unchanged" : "Show unchanged"}
            </button>
            <button type="button" onClick={() => { setText(""); setComparisonText(""); setShowUnchangedRows(false); }} className={actionClass}>
              Clear
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Changed lines</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{diffResult?.linesChanged ?? 0}</div>
            </div>
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Added lines</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{diffResult?.linesAdded ?? 0}</div>
            </div>
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Removed lines</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{diffResult?.linesRemoved ?? 0}</div>
            </div>
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Word delta</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">
                +{diffResult?.wordsAdded ?? 0} / -{diffResult?.wordsRemoved ?? 0}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Comparison preview</h2>
              {!showUnchangedRows && (diffResult?.unchangedLines ?? 0) > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {diffResult?.unchangedLines} unchanged line{diffResult?.unchangedLines === 1 ? "" : "s"} hidden
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {visibleRows.map((row, index) => (
                <div key={`${row.type}-${index}`} className="grid gap-3 border-t border-border/60 pt-3 lg:grid-cols-2">
                  <div className={`p-3 text-sm leading-6 ${row.type === "remove" || row.type === "change" ? "bg-danger-soft/60" : row.type === "same" ? "text-muted-foreground" : ""}`}>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Original</div>
                    {row.type === "change" ? renderDiffSegments(row.leftSegments, "left") : row.left || <span className="text-muted-foreground">No content</span>}
                  </div>
                  <div className={`p-3 text-sm leading-6 ${row.type === "add" || row.type === "change" ? "bg-primary-soft/60" : row.type === "same" ? "text-muted-foreground" : ""}`}>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Revised</div>
                    {row.type === "change" ? renderDiffSegments(row.rightSegments, "right") : row.right || <span className="text-muted-foreground">No content</span>}
                  </div>
                </div>
              ))}
              {!visibleRows.length ? (
                <p className="border-t border-border/60 pt-3 text-sm text-muted-foreground">
                  Paste both versions to start comparing text.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tool.family === "reference") {
    return (
      <section className="tool-frame p-4 sm:p-6">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Search characters, names, or code points</span>
              <input
                value={tableQuery}
                onChange={(event) => setTableQuery(event.target.value)}
                placeholder="Try space, U+200B, tab, arrow, 65, em dash"
                className={inputClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Scope</span>
              <select value={tableScope} onChange={(event) => setTableScope(event.target.value as CharacterTableScope)} className={selectClass}>
                <option value="all">All</option>
                <option value="ascii">ASCII</option>
                <option value="unicode">Unicode</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Results</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{characterTableResults.length}</div>
            </div>
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Scope</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{tableScope.toUpperCase()}</div>
            </div>
            <div className="border border-border/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Query</div>
              <div className="mt-2 text-sm font-semibold text-foreground">{tableQuery || "Showing defaults"}</div>
            </div>
          </div>

          <div className="overflow-x-auto border-t border-border/60 pt-4">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="py-3 pr-4 font-semibold">Char</th>
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Code point</th>
                  <th className="py-3 pr-4 font-semibold">Decimal</th>
                  <th className="py-3 pr-4 font-semibold">Category</th>
                  <th className="py-3 font-semibold">Copy</th>
                </tr>
              </thead>
              <tbody>
                {characterTableResults.map((entry) => (
                  <tr key={`${entry.scope}-${entry.codepoint}`} className="border-b border-border/40 align-top">
                    <td className="py-3 pr-4 font-mono text-base text-foreground">
                      {entry.category === "ASCII Control" ? "CTL" : entry.char === " " ? "␠" : entry.char || "∅"}
                    </td>
                    <td className="py-3 pr-4 text-foreground">{entry.name}</td>
                    <td className="py-3 pr-4 font-mono text-muted-foreground">{entry.codepoint}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{entry.decimal}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{entry.category}</td>
                    <td className="py-3">
                      <button type="button" onClick={() => navigator.clipboard.writeText(entry.char)} className={actionClass}>
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          {tool.family !== "generator" && !(tool.family === "unicode" && tool.mode === "invisible") ? (
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={`Paste text into ${tool.name.toLowerCase()}.`} className={textareaClass} />
          ) : null}
          <textarea value={outputValue || ""} readOnly placeholder={tool.family === "generator" ? "Generated output appears here." : "Output appears here."} className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            {tool.family === "generator" ? (
              <button type="button" onClick={() => setLoremSeed((value) => value + 1)} className={actionClass}>
                Generate again
              </button>
            ) : null}
            <button type="button" onClick={() => navigator.clipboard.writeText(outputValue || "")} className={actionClass}>Copy result</button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setComparisonText("");
                setPhraseLength(2);
                setSlugSeparator("-");
                setSlugLowercase(true);
                setLoremAmount(3);
                setLoremUnit("paragraphs");
                setStartWithLorem(true);
                setLoremSeed(0);
                setFancyStyle("bold");
                setInvisibleMode("zero-width-space");
                setInvisibleCount(1);
                setListDirection("text-to-list");
                setListDelimiter(",");
                setListTrimItems(true);
                setListIgnoreEmpty(true);
                setFrequencyCaseSensitive(false);
                setFrequencyIncludeWhitespace(false);
                setZalgoIntensity("medium");
                setZalgoPosition("all");
                setTableQuery("");
                setTableScope("all");
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>

        <aside className={`space-y-4 ${panelClass}`}>
          {tool.family === "line" && tool.focus === "sort" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Direction</span>
              <select value={direction} onChange={(event) => setDirection(event.target.value as typeof direction)} className={selectClass}>
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
          {tool.family === "stats" && tool.focus === "readability" ? (
            <div className="space-y-3">
              <div className="border border-border/60 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Reading ease</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{readabilityResult?.fleschReadingEase.toFixed(1) ?? "0.0"}</div>
                <p className="mt-1 text-sm text-muted-foreground">{readabilityResult?.fleschReadingEaseLabel ?? "Paste text to score it."}</p>
              </div>
              <div className="border border-border/60 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Grade level</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{readabilityResult?.fleschKincaidGrade.toFixed(1) ?? "0.0"}</div>
                <p className="mt-1 text-sm text-muted-foreground">{readabilityResult?.fleschKincaidGradeLabel ?? "Reading level estimate"}</p>
              </div>
            </div>
          ) : null}
          {tool.family === "stats" && tool.focus === "characters" ? (
            <>
              <label className="flex items-center gap-3 text-sm text-foreground">
                <input type="checkbox" checked={frequencyCaseSensitive} onChange={(event) => setFrequencyCaseSensitive(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Case-sensitive counting
              </label>
              <label className="flex items-center gap-3 text-sm text-foreground">
                <input type="checkbox" checked={frequencyIncludeWhitespace} onChange={(event) => setFrequencyIncludeWhitespace(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Include whitespace
              </label>
              <div className="space-y-3">
                <div className="border border-border/60 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unique characters</div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">{characterFrequencyResult?.uniqueCharacters ?? 0}</div>
                </div>
                <div className="border border-border/60 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Counted characters</div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">{characterFrequencyResult?.totalCharacters ?? 0}</div>
                </div>
              </div>
            </>
          ) : null}
          {tool.family === "transform" ? (
            <>
              {tool.mode === "slug" ? (
                <>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Separator</span>
                    <input value={slugSeparator} maxLength={3} onChange={(event) => setSlugSeparator(event.target.value || "-")} className={inputClass} />
                  </label>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <input type="checkbox" checked={slugLowercase} onChange={(event) => setSlugLowercase(event.target.checked)} className="h-4 w-4 rounded border-border" />
                    Lowercase output
                  </label>
                </>
              ) : (
                <>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Direction</span>
                    <select value={listDirection} onChange={(event) => setListDirection(event.target.value as ListDirection)} className={selectClass}>
                      <option value="text-to-list">Inline text to list</option>
                      <option value="list-to-text">List to inline text</option>
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Delimiter</span>
                    <input value={listDelimiter} onChange={(event) => setListDelimiter(event.target.value || ",")} className={inputClass} />
                  </label>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <input type="checkbox" checked={listTrimItems} onChange={(event) => setListTrimItems(event.target.checked)} className="h-4 w-4 rounded border-border" />
                    Trim each item
                  </label>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <input type="checkbox" checked={listIgnoreEmpty} onChange={(event) => setListIgnoreEmpty(event.target.checked)} className="h-4 w-4 rounded border-border" />
                    Ignore empty items
                  </label>
                </>
              )}
            </>
          ) : null}
          {tool.family === "generator" ? (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Amount</span>
                <input type="number" min="1" max="50" value={loremAmount} onChange={(event) => setLoremAmount(Math.max(Number(event.target.value) || 1, 1))} className={inputClass} />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Generate</span>
                <select value={loremUnit} onChange={(event) => setLoremUnit(event.target.value as typeof loremUnit)} className={selectClass}>
                  <option value="paragraphs">Paragraphs</option>
                  <option value="sentences">Sentences</option>
                  <option value="words">Words</option>
                </select>
              </label>
              <label className="flex items-center gap-3 text-sm text-foreground">
                <input type="checkbox" checked={startWithLorem} onChange={(event) => setStartWithLorem(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Start with &quot;Lorem ipsum&quot;
              </label>
            </>
          ) : null}
          {tool.family === "unicode" && tool.mode === "fancy-font" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Font style</span>
              <select value={fancyStyle} onChange={(event) => setFancyStyle(event.target.value as FancyFontStyle)} className={selectClass}>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
                <option value="bold-italic">Bold italic</option>
                <option value="script">Script</option>
                <option value="double-struck">Double-struck</option>
                <option value="sans-bold">Sans bold</option>
                <option value="monospace">Monospace</option>
              </select>
            </label>
          ) : null}
          {tool.family === "unicode" && tool.mode === "invisible" ? (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Invisible character</span>
                <select value={invisibleMode} onChange={(event) => setInvisibleMode(event.target.value as InvisibleCharacterMode)} className={selectClass}>
                  <option value="zero-width-space">Zero-width space</option>
                  <option value="zero-width-non-joiner">Zero-width non-joiner</option>
                  <option value="zero-width-joiner">Zero-width joiner</option>
                  <option value="word-joiner">Word joiner</option>
                  <option value="hangul-filler">Hangul filler</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Repeat count</span>
                <input type="number" min="1" max="200" value={invisibleCount} onChange={(event) => setInvisibleCount(Math.max(Number(event.target.value) || 1, 1))} className={inputClass} />
              </label>
              <div className="space-y-3">
                <div className="border border-border/60 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Character type</div>
                  <div className="mt-2 text-sm font-semibold text-foreground">{invisibleResult?.label ?? "Invisible character"}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{invisibleResult?.codepoint ?? ""}</p>
                </div>
                <div className="border border-border/60 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output length</div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">{invisibleResult?.count ?? 0}</div>
                </div>
              </div>
            </>
          ) : null}
          {tool.family === "unicode" && tool.mode === "zalgo" ? (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Intensity</span>
                <select value={zalgoIntensity} onChange={(event) => setZalgoIntensity(event.target.value as ZalgoIntensity)} className={selectClass}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Mark placement</span>
                <select value={zalgoPosition} onChange={(event) => setZalgoPosition(event.target.value as ZalgoPosition)} className={selectClass}>
                  <option value="all">All</option>
                  <option value="above">Above</option>
                  <option value="middle">Middle</option>
                  <option value="below">Below</option>
                </select>
              </label>
            </>
          ) : null}
          {tool.family === "unicode" && tool.mode !== "invisible" ? (
            <div className="border border-primary/15 bg-primary-soft p-4 text-sm leading-6 text-primary-soft-foreground">
              Unicode styling depends on font support in the app where you paste the result, so preview the copied output once before you use it publicly.
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
