import React from "react";
import dynamic from "next/dynamic";
import type { BackslashMode, TextCleanerOptions, WhitespaceMode } from "@/lib/tools/text-cleaner";

const UrlEncoderDecoderTool = dynamic(() => import("@/components/tools/converters/UrlEncoderDecoderTool"));
const Base64ConverterTool = dynamic(() => import("@/components/tools/converters/Base64EncoderDecoderTool"));
const Rot13Tool = dynamic(() => import("@/components/tools/converters/Rot13Tool"));
const Rot47Tool = dynamic(() => import("@/components/tools/converters/Rot47Tool"));
const BinaryTool = dynamic(() => import("@/components/tools/converters/BinaryTool"));
const HexTool = dynamic(() => import("@/components/tools/converters/HexTool"));
const OctalTool = dynamic(() => import("@/components/tools/converters/OctalTool"));
const DecimalTool = dynamic(() => import("@/components/tools/converters/DecimalTool"));
const PunycodeTool = dynamic(() => import("@/components/tools/converters/PunycodeTool"));
const IdnTool = dynamic(() => import("@/components/tools/converters/IdnTool"));
import type { SortMode, SortScope } from "@/lib/tools/line-tools";
import type { TextAlignMode } from "@/lib/tools/text-aligner";
import type { ExtractorMode } from "@/lib/tools/text-extractors";
import type { EncodingMode } from "@/lib/tools/encoding-tools";
import type { DataFormat } from "@/lib/tools/data-format-converter";
import type { TimeMode } from "@/lib/tools/time-converter";
import type { UnitMode } from "@/lib/tools/unit-converter";
import type { CodeAction, CodeLanguage } from "@/lib/tools/code-formatters";
import type { RandomMode } from "@/lib/tools/random-generators";
import { buildConvertDescription, buildConvertName, withConvertSlug } from "@/lib/tools/conversion-routes";
import type { FreeToolMeta } from "@/types/tools";

type BaseTool = Omit<FreeToolMeta, "href"> & { slug: string };

export type ExactTextTool =
  | (BaseTool & {
      family: "cleaner";
      preset: Partial<TextCleanerOptions>;
      hiddenKeys?: Array<"whitespaceMode" | "backslashMode" | keyof TextCleanerOptions>;
      lockedKeys?: Array<keyof TextCleanerOptions>;
    })
  | (BaseTool & {
      family: "line";
      preset: {
        scope?: SortScope;
        sortMode?: SortMode;
        reverseOrder?: boolean;
        addLineNumbers?: boolean;
        uniqueOnly?: boolean;
        truncateLength?: number;
      };
      focus: "prefix" | "suffix" | "prefix-suffix" | "filter" | "join" | "sort" | "truncate" | "none";
    })
  | (BaseTool & {
      family: "align";
      mode: TextAlignMode;
    })
  | (BaseTool & {
      family: "extractor";
      mode: ExtractorMode;
    })
  | (BaseTool & {
      family: "regex";
      mode: "extract" | "replace";
    })
  | (BaseTool & {
      family: "stats";
      focus: "overview" | "phrases" | "longest" | "shortest" | "readability" | "characters";
    })
  | (BaseTool & {
      family: "transform";
      mode: "slug" | "list";
    })
  | (BaseTool & {
      family: "generator";
      mode: "lorem";
    })
  | (BaseTool & {
      family: "compare";
      mode: "diff";
    })
  | (BaseTool & {
      family: "unicode";
      mode: "fancy-font" | "upside-down" | "tiny-text" | "invisible" | "zalgo";
    })
  | (BaseTool & {
      family: "reference";
      mode: "character-table";
    });

export type ExactConverterTool =
  | (BaseTool & { 
      family: "encoding"; 
      mode: EncodingMode; 
      guide?: React.ReactNode; 
      bonusFaqs?: Array<{ question: string; answer: string }>;
      customRunner?: React.ComponentType<{ tool: any }>;
    })
  | (BaseTool & { 
      family: "data"; 
      from: DataFormat; 
      to: DataFormat;
      guide?: React.ReactNode;
      bonusFaqs?: Array<{ question: string; answer: string }>;
      customRunner?: React.ComponentType<{ tool: any }>;
    })
  | (BaseTool & { 
      family: "time"; 
      mode: TimeMode;
      guide?: React.ReactNode;
      bonusFaqs?: Array<{ question: string; answer: string }>;
      customRunner?: React.ComponentType<{ tool: any }>;
    })
  | (BaseTool & { 
      family: "unit"; 
      mode: UnitMode;
      guide?: React.ReactNode;
      bonusFaqs?: Array<{ question: string; answer: string }>;
      customRunner?: React.ComponentType<{ tool: any }>;
    });

export type ExactUtilityTool =
  | (BaseTool & { family: "code"; language: CodeLanguage; action: CodeAction })
  | (BaseTool & { family: "random"; mode: RandomMode });

const text = (tool: ExactTextTool): ExactTextTool => tool;

function conversionText(tool: ExactTextTool, from: string, to: string): ExactTextTool {
  return text({
    ...tool,
    slug: withConvertSlug(tool.slug),
    name: buildConvertName(from, to),
    description: buildConvertDescription(from, to, tool.description),
  });
}

function getEncodingLabels(mode: EncodingMode) {
  const labels: Record<EncodingMode, { from: string; to: string }> = {
    "url-encode": { from: "Text", to: "URL Encoding" },
    "url-decode": { from: "URL Encoding", to: "Text" },
    "html-encode": { from: "Text", to: "HTML Entities" },
    "html-decode": { from: "HTML Entities", to: "Text" },
    "base64-encode": { from: "Text", to: "Base64" },
    "base64-decode": { from: "Base64", to: "Text" },
    rot13: { from: "Text", to: "ROT13 Text" },
    rot47: { from: "Text", to: "ROT47 Text" },
    "text-to-binary": { from: "Text", to: "Binary" },
    "binary-to-text": { from: "Binary", to: "Text" },
    "text-to-hex": { from: "Text", to: "Hex" },
    "hex-to-text": { from: "Hex", to: "Text" },
    "text-to-octal": { from: "Text", to: "Octal" },
    "octal-to-text": { from: "Octal", to: "Text" },
    "text-to-decimal": { from: "Text", to: "Decimal" },
    "decimal-to-text": { from: "Decimal", to: "Text" },
    "punycode-encode": { from: "Text", to: "Punycode" },
    "punycode-decode": { from: "Punycode", to: "Text" },
    "idn-encode": { from: "Unicode Domain", to: "ASCII Domain" },
    "idn-decode": { from: "ASCII Domain", to: "Unicode Domain" },
  };

  return labels[mode];
}

function getTimeLabels(mode: TimeMode) {
  const labels: Record<TimeMode, { from: string; to: string }> = {
    "unix-to-utc": { from: "UNIX Time", to: "UTC Time" },
    "utc-to-unix": { from: "UTC Time", to: "UNIX Time" },
    "seconds-to-hms": { from: "Seconds", to: "H:M:S" },
    "hms-to-seconds": { from: "H:M:S", to: "Seconds" },
    "seconds-to-human": { from: "Seconds", to: "Human Readable Time" },
  };

  return labels[mode];
}

function getUnitLabels(mode: UnitMode) {
  const labels: Record<UnitMode, { from: string; to: string }> = {
    "miles-to-km": { from: "Miles", to: "Kilometers" },
    "km-to-miles": { from: "Kilometers", to: "Miles" },
    "c-to-f": { from: "Celsius", to: "Fahrenheit" },
    "f-to-c": { from: "Fahrenheit", to: "Celsius" },
    "deg-to-rad": { from: "Degrees", to: "Radians" },
    "rad-to-deg": { from: "Radians", to: "Degrees" },
    "lb-to-kg": { from: "Pounds", to: "Kilograms" },
    "kg-to-lb": { from: "Kilograms", to: "Pounds" },
    "hex-to-rgb": { from: "Hex", to: "RGB" },
    "rgb-to-hex": { from: "RGB", to: "Hex" },
    "cmyk-to-rgb": { from: "CMYK", to: "RGB" },
    "rgb-to-cmyk": { from: "RGB", to: "CMYK" },
  };

  return labels[mode];
}

function formatDataLabel(format: DataFormat) {
  const labels: Record<DataFormat, string> = {
    json: "JSON",
    csv: "CSV",
    yaml: "YAML",
    xml: "XML",
    html: "HTML",
    markdown: "Markdown",
    text: "Text",
  };

  return labels[format];
}

function getConverterLabels(tool: ExactConverterTool) {
  switch (tool.family) {
    case "encoding":
      return getEncodingLabels(tool.mode);
    case "data":
      return {
        from: formatDataLabel(tool.from),
        to: formatDataLabel(tool.to),
      };
    case "time":
      return getTimeLabels(tool.mode);
    case "unit":
      return getUnitLabels(tool.mode);
  }
}

const converter = (tool: ExactConverterTool): ExactConverterTool => {
  const labels = getConverterLabels(tool);

  return {
    ...tool,
    slug: withConvertSlug(tool.slug),
    name: buildConvertName(labels.from, labels.to),
    description: buildConvertDescription(labels.from, labels.to, tool.description),
  };
};

const utility = (tool: ExactUtilityTool): ExactUtilityTool => tool;

export const EXACT_TEXT_TOOLS = [
  text({ slug: "trim-text-lines", name: "Trim Text Lines", description: "Trim leading and trailing whitespace from every line in one pass.", category: "Text", icon: "TRIM", family: "cleaner", preset: { trimLines: true }, lockedKeys: ["trimLines"], hiddenKeys: ["whitespaceMode", "backslashMode", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "empty-line-remover", name: "Empty Line Remover", description: "Remove blank lines from multiline text while preserving the rest of the content order.", category: "Text", icon: "EMPTY", family: "cleaner", preset: { removeEmptyLines: true }, lockedKeys: ["removeEmptyLines"], hiddenKeys: ["whitespaceMode", "backslashMode", "trimLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "extra-whitespaces-remover", name: "Extra Whitespaces Remover", description: "Collapse repeated spaces and tabs into cleaner, tighter text.", category: "Text", icon: "WS", family: "cleaner", preset: { collapseSpaces: true }, lockedKeys: ["collapseSpaces"], hiddenKeys: ["whitespaceMode", "backslashMode", "trimLines", "removeEmptyLines", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "all-whitespaces-remover", name: "All Whitespaces Remover", description: "Strip all whitespace characters from text, including spaces, tabs, and line breaks.", category: "Text", icon: "NOWS", family: "cleaner", preset: { removeAllWhitespace: true }, lockedKeys: ["removeAllWhitespace"], hiddenKeys: ["whitespaceMode", "backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removePunctuation", "removeAccents"] }),
  text({ slug: "punctuation-mark-remover", name: "Punctuation Mark Remover", description: "Remove punctuation marks from text for quick normalization and cleanup.", category: "Text", icon: "PUNC", family: "cleaner", preset: { removePunctuation: true }, lockedKeys: ["removePunctuation"], hiddenKeys: ["whitespaceMode", "backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removeAccents"] }),
  text({ slug: "character-accent-remover", name: "Character Accent Remover", description: "Strip accents and diacritics from letters while keeping the base characters.", category: "Text", icon: "ACC", family: "cleaner", preset: { removeAccents: true }, lockedKeys: ["removeAccents"], hiddenKeys: ["whitespaceMode", "backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation"] }),
  text({ slug: "backslash-remover", name: "Backslash Remover", description: "Remove backslashes from text, escaped strings, and copied snippets.", category: "Text", icon: "BSRM", family: "cleaner", preset: { backslashMode: "remove" as BackslashMode }, lockedKeys: ["backslashMode"], hiddenKeys: ["whitespaceMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "backslash-adder", name: "Backslash Adder", description: "Add backslashes before quotes and existing slashes for quick escaping.", category: "Text", icon: "BSAD", family: "cleaner", preset: { backslashMode: "add" as BackslashMode }, lockedKeys: ["backslashMode"], hiddenKeys: ["whitespaceMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  conversionText({ slug: "spaces-to-tabs", name: "Spaces to Tabs Converter", description: "Convert repeated spaces into tab characters for quick text cleanup.", category: "Text", icon: "S2T", family: "cleaner", preset: { whitespaceMode: "spaces-to-tabs" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }, "Spaces", "Tabs"),
  conversionText({ slug: "tabs-to-spaces", name: "Tabs to Spaces Converter", description: "Replace tab characters with spaces in copied code and plain text.", category: "Text", icon: "T2S", family: "cleaner", preset: { whitespaceMode: "tabs-to-spaces" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }, "Tabs", "Spaces"),
  conversionText({ slug: "spaces-to-newlines", name: "Spaces to Newlines Converter", description: "Turn space-separated text into newline-separated text in one pass.", category: "Text", icon: "S2N", family: "cleaner", preset: { whitespaceMode: "spaces-to-newlines" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }, "Spaces", "Newlines"),
  conversionText({ slug: "newlines-to-spaces", name: "Newlines to Spaces Converter", description: "Flatten multiline text into one space-separated line.", category: "Text", icon: "N2S", family: "cleaner", preset: { whitespaceMode: "newlines-to-spaces" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }, "Newlines", "Spaces"),
  text({ slug: "text-line-reverser", name: "Text Line Reverser", description: "Reverse the order of lines in pasted text while keeping line content intact.", category: "Text", icon: "REVL", family: "line", preset: { reverseOrder: true }, focus: "none" }),
  text({ slug: "add-line-numbers", name: "Add Line Numbers", description: "Number every line in pasted text for quick review, quoting, and reference.", category: "Text", icon: "NUM", family: "line", preset: { addLineNumbers: true }, focus: "none" }),
  text({ slug: "add-line-prefixes", name: "Add Line Prefixes", description: "Add the same prefix to every line in a multiline text block.", category: "Text", icon: "PFX", family: "line", preset: {}, focus: "prefix" }),
  text({ slug: "add-line-suffixes", name: "Add Line Suffixes", description: "Add the same suffix to every line in a multiline text block.", category: "Text", icon: "SFX", family: "line", preset: {}, focus: "suffix" }),
  text({ slug: "prefix-and-suffix-text-lines", name: "Prefix and Suffix Text Lines", description: "Add both a prefix and a suffix to every line at once.", category: "Text", icon: "PSFX", family: "line", preset: {}, focus: "prefix-suffix" }),
  text({ slug: "text-line-filter", name: "Text Line Filter", description: "Keep only the lines that match a query string from pasted text.", category: "Text", icon: "FLT", family: "line", preset: {}, focus: "filter" }),
  text({ slug: "text-line-joiner", name: "Text Line Joiner", description: "Join multiple lines into one output string using a custom delimiter.", category: "Text", icon: "JOIN", family: "line", preset: {}, focus: "join" }),
  text({ slug: "truncate-text-lines", name: "Truncate Text Lines", description: "Cut each line to a fixed maximum length without touching the rest of the text order.", category: "Text", icon: "CUT", family: "line", preset: {}, focus: "truncate" }),
  text({ slug: "alphabetic-text-sorter", name: "Alphabetic Text Sorter", description: "Sort lines alphabetically in ascending or descending order.", category: "Text", icon: "AZ", family: "line", preset: { sortMode: "alphabetic" as SortMode }, focus: "sort" }),
  text({ slug: "numeric-text-sorter", name: "Numeric Text Sorter", description: "Sort number-like lines numerically instead of alphabetically.", category: "Text", icon: "123", family: "line", preset: { sortMode: "numeric" as SortMode }, focus: "sort" }),
  text({ slug: "text-by-length-sorter", name: "Text by Length Sorter", description: "Sort text lines by their character length.", category: "Text", icon: "LEN", family: "line", preset: { sortMode: "length" as SortMode }, focus: "sort" }),
  text({ slug: "word-sorter", name: "Word Sorter", description: "Split text into words and sort them alphabetically.", category: "Text", icon: "WORD", family: "line", preset: { scope: "words" as SortScope, sortMode: "alphabetic" as SortMode }, focus: "sort" }),
  text({ slug: "center-text", name: "Center Text", description: "Center each line of text within a fixed width.", category: "Text", icon: "CTR", family: "align", mode: "center" }),
  text({ slug: "left-pad-text", name: "Left-Pad Text", description: "Pad the left side of each line to reach a target width.", category: "Text", icon: "LPAD", family: "align", mode: "left-pad" }),
  text({ slug: "right-pad-text", name: "Right-Pad Text", description: "Pad the right side of each line to reach a target width.", category: "Text", icon: "RPAD", family: "align", mode: "right-pad" }),
  text({ slug: "justify-text", name: "Justify Text", description: "Distribute spaces across each line to justify text to a target width.", category: "Text", icon: "JUST", family: "align", mode: "justify" }),
  text({ slug: "email-extractor", name: "Email Extractor", description: "Extract email addresses from pasted text in one pass.", category: "Text", icon: "MAIL", family: "extractor", mode: "email" }),
  text({ slug: "url-extractor", name: "URL Extractor", description: "Extract URLs and web addresses from pasted text.", category: "Text", icon: "URL", family: "extractor", mode: "url" }),
  text({ slug: "number-extractor", name: "Number Extractor", description: "Extract numbers from pasted text, including decimals and signed values.", category: "Text", icon: "NUMX", family: "extractor", mode: "number" }),
  text({ slug: "regex-match-extractor", name: "Regex Match Extractor", description: "Extract matches from text using your own regular expression pattern and flags.", category: "Text", icon: "RXE", family: "regex", mode: "extract" }),
  text({ slug: "regex-match-replacer", name: "Regex Match Replacer", description: "Replace regex matches in text using custom patterns, flags, and replacement text.", category: "Text", icon: "RXR", family: "regex", mode: "replace" }),
  text({ slug: "text-statistics-tool", name: "Text Statistics", description: "Inspect line counts, paragraph counts, letter frequency, and repeated phrases from any text block.", category: "Text", icon: "STAT", family: "stats", focus: "overview" }),
  text({ slug: "phrase-frequency-calculator", name: "Phrase Frequency Calculator", description: "Find repeated phrases and surface the most frequent phrase combinations in text.", category: "Text", icon: "PHRASE", family: "stats", focus: "phrases" }),
  text({ slug: "find-longest-text-line", name: "Find Longest Text Line", description: "Find the longest non-empty line in pasted multiline text.", category: "Text", icon: "LONG", family: "stats", focus: "longest" }),
  text({ slug: "find-shortest-text-line", name: "Find Shortest Text Line", description: "Find the shortest non-empty line in pasted multiline text.", category: "Text", icon: "SHORT", family: "stats", focus: "shortest" }),
  text({ slug: "text-to-slug-converter", name: "Text to Slug Converter", description: "Convert titles, phrases, and headings into clean URL-friendly slugs.", category: "Text", icon: "SLUG", family: "transform", mode: "slug" }),
  text({ slug: "text-to-list-list-to-text", name: "Text to List / List to Text", description: "Convert comma-separated text into vertical lists and join line-based lists back into one string.", category: "Text", icon: "LIST", family: "transform", mode: "list" }),
  text({ slug: "readability-flesch-kincaid-calculator", name: "Readability / Flesch-Kincaid Calculator", description: "Score pasted text for reading ease, grade level, and sentence complexity.", category: "Text", icon: "READ", family: "stats", focus: "readability" }),
  text({ slug: "character-frequency-map", name: "Character Frequency Map", description: "Count repeated characters, whitespace, and symbols inside any pasted text block.", category: "Text", icon: "CHAR", family: "stats", focus: "characters" }),
  text({ slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs, sentences, or words for mockups and drafts.", category: "Text", icon: "LOREM", family: "generator", mode: "lorem" }),
  text({ slug: "text-difference-checker", name: "Text Difference Checker", description: "Compare two text blocks and highlight added, removed, and changed lines.", category: "Text", icon: "DIFF", family: "compare", mode: "diff" }),
  text({ slug: "fancy-font-generator", name: "Fancy Font Generator", description: "Convert plain text into stylized Unicode font variants such as bold, script, monospace, and double-struck.", category: "Text", icon: "FONT", family: "unicode", mode: "fancy-font" }),
  text({ slug: "upside-down-text-generator", name: "Upside Down Text Generator", description: "Flip text upside down with mirrored Unicode characters for playful captions and posts.", category: "Text", icon: "FLIP", family: "unicode", mode: "upside-down" }),
  text({ slug: "tiny-text-generator", name: "Tiny Text Generator", description: "Convert normal text into tiny superscript-style Unicode characters.", category: "Text", icon: "TINY", family: "unicode", mode: "tiny-text" }),
  text({ slug: "invisible-character-generator", name: "Invisible Character / Empty Text", description: "Generate zero-width and empty-looking Unicode characters you can copy into forms, bios, and messages.", category: "Text", icon: "VOID", family: "unicode", mode: "invisible" }),
  text({ slug: "zalgo-glitch-text-generator", name: "Zalgo / Glitch Text Generator", description: "Apply stacked combining marks to create chaotic glitch-style Unicode text.", category: "Text", icon: "ZALG", family: "unicode", mode: "zalgo" }),
  text({ slug: "unicode-ascii-table-search", name: "Unicode/ASCII Table Search", description: "Search ASCII codes and common Unicode characters by name, code point, or character.", category: "Text", icon: "U+00", family: "reference", mode: "character-table" }),
] as const;

export const EXACT_CONVERTER_TOOLS = [
  converter({ 
    slug: "url-encoder-decoder", 
    name: "URL Encoder/Decoder", 
    description: "Free online URL encoder and decoder. Convert text to percent-encoded format or decode percent-encoded URLs instantly.", 
    category: "Converter", 
    icon: "URL", 
    family: "encoding", 
    mode: "url-encode",
    customRunner: UrlEncoderDecoderTool as any,
    bonusFaqs: [
      {
        question: "Why does a space become %20 in URLs?",
        answer: "Space characters are not allowed in URLs because they are used as separators in many protocols. URL encoding converts a space to '%20' (the hexadecimal representation of ASCII character 32) to ensure the URL remains syntactically valid."
      },
      {
        question: "Is there a difference between %20 and + for spaces?",
        answer: "Yes. '%20' is the standard percent-encoding for any URL component. '+' is specifically used for spaces in query strings (the 'application/x-www-form-urlencoded' format). Our tool supports both behaviors."
      }
    ],
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>URL Encoding Explained: When and Why Special Characters Get Converted</h2>
        <p>
          URL encoding, or percent-encoding, is a mechanism for translating characters that have special meaning in a URL into a safe format that can be understood by web servers and browsers. A URL can only contain a limited set of ASCII characters. If you need to include characters outside this set—like spaces, emojis, or reserved symbols—they must be encoded.
        </p>
        <h3>The Anatomy of Percent-Encoding</h3>
        <p>
          Each unsafe character is replaced by a percent sign (%) followed by its two-digit hexadecimal equivalent. For instance, the ampersand (<code>&amp;</code>) becomes <code>%26</code>. This ensures that the ampersand isn't confused with a query parameter separator.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "html-entity-encoder-decoder", 
    name: "HTML Entity Encoder/Decoder", 
    description: "Free online HTML entity encoder and decoder. Convert text to HTML entities or decode them instantly.", 
    category: "Converter", 
    icon: "HTML", 
    family: "encoding", 
    mode: "html-encode",
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>HTML Entity Encoding Explained</h2>
        <p>
          HTML entity encoding is a secure way to prevent Cross-Site Scripting (XSS) by translating special characters like &lt; and &gt; into safe formats that browsers render as text rather than code.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "base64-encoder-decoder", 
    name: "Base64 Encoder/Decoder", 
    description: "Free online Base64 encoder and decoder. Encode text and files into Base64 or decode them back, with support for data URLs and URL-safe variants.", 
    category: "Converter", 
    icon: "B64", 
    family: "encoding", 
    mode: "base64-encode",
    customRunner: Base64ConverterTool as any,
    bonusFaqs: [
      {
        question: "What's the difference between Base64 and URL encoding?",
        answer: "Base64 turns binary data into a set of 64 character representations for storage or transport. URL encoding (percent-encoding) translates characters that are 'unsafe' for a URI into a hex-based format. They serve entirely different purposes."
      }
    ],
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>Base64 Encoding: Why It's Used in APIs, Email, and Data URIs</h2>
        <p>
          Base64 is not encryption; it is an encoding scheme that represents binary data in an ASCII string format. It is primarily used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "rot13-encoder-decoder", 
    name: "ROT13 Encoder/Decoder", 
    description: "Rotate alphabetic characters by 13 positions in either direction.", 
    category: "Converter", 
    icon: "ROT13", 
    family: "encoding", 
    mode: "rot13",
    customRunner: Rot13Tool as any,
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>ROT13 Cipher Explained: Simple Substitution for Spoiling and Fun</h2>
        <p>
          ROT13 ("rotate by 13 places") is a simple substitution cipher that replaces a letter with the 13th letter after it in the alphabet. Because there are 26 letters in the Latin alphabet, the same algorithm is used to both encode and decode.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "rot47-encoder-decoder", 
    name: "ROT47 Encoder/Decoder", 
    description: "Rotate printable ASCII characters with the ROT47 cipher.", 
    category: "Converter", 
    icon: "ROT47", 
    family: "encoding", 
    mode: "rot47",
    customRunner: Rot47Tool as any,
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>ROT47 Cipher: Extended ASCII Substitution</h2>
        <p>
          ROT47 is a derivative of ROT13 that expands the rotation to include all printable ASCII characters. By shifting characters by 47 positions, it provides a much larger character set for simple obfuscation.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "binary-encoder-decoder", 
    name: "Binary Encoder/Decoder", 
    description: "Free online Binary encoder and decoder. Convert text to 8-bit binary strings and decode them back to readable text.", 
    category: "Converter", 
    icon: "BIN", 
    family: "encoding", 
    mode: "text-to-binary",
    customRunner: BinaryTool as any,
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>Binary Logic: The Foundational Language of Computing</h2>
        <p>
          Binary encoding represents each character as a unique 8-bit sequence (a byte). This is how computers actually store and process text at the hardware level.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "hex-encoder-decoder", 
    name: "Hex Encoder/Decoder", 
    description: "Free online Hex encoder and decoder. Convert text to hexadecimal byte values and decode them back into text.", 
    category: "Converter", 
    icon: "HEX", 
    family: "encoding", 
    mode: "text-to-hex",
    customRunner: HexTool as any,
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>Hexadecimal Encoding: Converting Text for Debugging</h2>
        <p>
          Hexadecimal (Base-16) is a compact way to represent binary data. It is widely used in debugging, memory analysis, and web design (CSS colors).
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "octal-encoder-decoder", 
    name: "Octal Encoder/Decoder", 
    description: "Free online Octal encoder and decoder. Convert text to octal byte values and decode them back into text.", 
    category: "Converter", 
    icon: "OCT", 
    family: "encoding", 
    mode: "text-to-octal",
    customRunner: OctalTool as any,
    bonusFaqs: [
      {
        question: "Where is octal still used today?",
        answer: "Octal is primarily used in Unix/Linux operating systems for setting file permissions (e.g., chmod 755). It is also used in some legacy digital displays and watermarking systems."
      },
      {
        question: "How do I convert octal to decimal?",
        answer: "Multiply each digit by 8 raised to the power of its position (from right to left, starting at 0). For example, octal 157 is (1*8^2) + (5*8^1) + (7*8^0) = 64 + 40 + 7 = 111 in decimal."
      }
    ],
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>Octal Representation: Understanding Base-8 Encoding for Legacy Systems</h2>
        <p>
          Octal is a base-8 number system that uses the digits 0 to 7. Historically, it was widely used in early computing when word sizes were multiples of 3 bits, or for representing Unix file permissions compactly. While binary and hexadecimal have become more dominant, octal remains a critical concept in historical computer science and specific operating system protocols.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "decimal-encoder-decoder", 
    name: "Decimal Encoder/Decoder", 
    description: "Free online Decimal encoder and decoder. Convert text to decimal character codes and decode them back into readable text.", 
    category: "Converter", 
    icon: "DEC", 
    family: "encoding", 
    mode: "text-to-decimal",
    customRunner: DecimalTool as any,
    bonusFaqs: [
      {
        question: "What is an ASCII character code?",
        answer: "ASCII (American Standard Code for Information Interchange) is a character encoding standard for electronic communication. Each character is assigned a unique number from 0 to 127. Unicode expands this set to over 140,000 characters."
      },
      {
        question: "How is decimal different from hex?",
        answer: "Decimal is Base-10 (using digits 0-9), while Hexadecimal is Base-16 (using 0-9 and A-F). Decimal is easier for human counting, while hex is more efficient for representing computer memory bytes."
      }
    ],
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>Decimal Encoding: Converting Text to Base-10 Character Codes</h2>
        <p>
          Decimal encoding involves representing characters using their numerical equivalent in the denary (Base-10) system. Every character on your keyboard and thousands of symbols besides have a specific integer value assigned to them in the Unicode standard. Converting text to decimal is a fundamental way to see how computers interpret "A" as 65 and "a" as 97.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "punycode-encoder-decoder", 
    name: "Punycode Encoder/Decoder", 
    description: "Free online Punycode encoder and decoder. Convert Unicode text to Punycode and back for domain name compatibility.", 
    category: "Converter", 
    icon: "PUNY", 
    family: "encoding", 
    mode: "punycode-encode",
    customRunner: PunycodeTool as any,
    bonusFaqs: [
      {
        question: "What is the xn-- prefix in domains?",
        answer: "The 'xn--' prefix is a signal used in the Domain Name System to indicate that the following label is encoded using Punycode. This allows the DNS, which historically only supported ASCII, to handle international characters."
      },
      {
        question: "Is Punycode the same as Unicode?",
        answer: "No. Unicode is a universal character set that includes characters from almost all writing systems. Punycode is an encoding algorithm that represents those Unicode characters using only the limited set of ASCII characters allowed in domain names."
      }
    ],
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>Punycode Explained: How International Domain Names Work</h2>
        <p>
          Internationalized Domain Names (IDNs) allow people around the world to use domain names in their local languages and scripts. However, the foundational systems of the internet were designed to only handle a small subset of ASCII characters. <strong>Punycode</strong> is the translation layer that makes IDNs possible.
        </p>
        <h3>The Translation Process</h3>
        <p>
          When you type a domain like <code>bücher.de</code>, your browser uses Punycode to convert it into <code>xn--bcher-kva.de</code>. This ASCII version is what is actually looked up in the global DNS registry, ensuring compatibility across all legacy systems while allowing users to see their native script.
        </p>
      </div>
    )
  }),
  converter({ 
    slug: "idn-encoder-decoder", 
    name: "IDN Encoder/Decoder", 
    description: "Free online IDN encoder and decoder. Convert Internationalized Domain Names to ASCII Punycode and back.", 
    category: "Converter", 
    icon: "IDN", 
    family: "encoding", 
    mode: "idn-encode",
    customRunner: IdnTool as any,
    bonusFaqs: [
      {
        question: "What is an Internationalized Domain Name (IDN)?",
        answer: "An IDN is a domain name that contains at least one character from a non-ASCII script, such as accents, Chinese characters, or Cyrillic letters. These are represented internally using Punycode."
      },
      {
        question: "Are IDNs secure?",
        answer: "Generally yes, but they are vulnerable to homograph attacks where a character looks identical to another (e.g., a Latin 'a' and a Cyrillic 'а'). Our tool includes a security audit to detect these potential spoofing risks."
      }
    ],
    guide: (
      <div className="prose prose-slate max-w-none">
        <h2>IDN Converters: Bridging the Gap Between Unicode and ASCII</h2>
        <p>
          Internationalized Domain Names allow the global community to access the web in their native scripts. While Punycode handled individual labels, an <strong>IDN Converter</strong> often handles entire URLs, ensuring that paths, query parameters, and subdomains are all correctly translated for legacy DNS systems.
        </p>
        <h3>Homograph Protection</h3>
        <p>
          One of the critical roles of a modern IDN tool is security. Because many characters in different languages look exactly the same (homoglyphs), malicious actors can create domains that look like <code>google.com</code> but are actually registered with characters from another script. Using an IDN converter reveals the hidden <code>xn--</code> syntax and helps identify these potential threats.
        </p>
      </div>
    )
  }),
  converter({ slug: "json-converter", name: "JSON Converter", description: "Convert JSON to CSV, YAML, XML, or plain text instantly. Professional JSON tool with validator and formatter.", category: "Converter", icon: "JSON", family: "data", from: "json", to: "csv" }),
  converter({ slug: "csv-converter", name: "CSV Converter", description: "Convert CSV to JSON or XML. Efficiently transform spreadsheet data into machine-readable formats.", category: "Converter", icon: "CSV", family: "data", from: "csv", to: "json" }),
  converter({ slug: "xml-converter", name: "XML Converter", description: "Convert XML to JSON, CSV, or YAML. Robust XML parser and transformer for data interchange.", category: "Converter", icon: "XML", family: "data", from: "xml", to: "json" }),
  converter({ slug: "yaml-converter", name: "YAML Converter", description: "Convert YAML to JSON or XML. Friendly YAML to machine-format transformer.", category: "Converter", icon: "YAML", family: "data", from: "yaml", to: "json" }),
  converter({ slug: "markdown-html-converter", name: "Markdown / HTML Converter", description: "Convert Markdown to HTML or HTML to Markdown instantly.", category: "Converter", icon: "MD", family: "data", from: "markdown", to: "html" }),
  converter({ slug: "unix-time-to-utc-time", name: "UNIX Time to UTC Time Converter", description: "Convert UNIX timestamps into UTC dates.", category: "Converter", icon: "UTC", family: "time", mode: "unix-to-utc" }),
  converter({ slug: "utc-time-to-unix-time", name: "UTC Time to UNIX Time Converter", description: "Convert UTC date strings into UNIX timestamps.", category: "Converter", icon: "UTC", family: "time", mode: "utc-to-unix" }),
  converter({ slug: "seconds-to-hms", name: "Seconds to H:M:S Converter", description: "Convert seconds into hour-minute-second format.", category: "Converter", icon: "HMS", family: "time", mode: "seconds-to-hms" }),
  converter({ slug: "hms-to-seconds", name: "H:M:S to Seconds Converter", description: "Convert H:M:S values into total seconds.", category: "Converter", icon: "SEC", family: "time", mode: "hms-to-seconds" }),
  converter({ slug: "seconds-to-human-readable-time", name: "Seconds to Human Readable Time", description: "Convert seconds into a human-readable duration string.", category: "Converter", icon: "TIME", family: "time", mode: "seconds-to-human" }),
  converter({ slug: "miles-to-kilometers", name: "Miles to Kilometers Converter", description: "Convert miles into kilometers.", category: "Converter", icon: "MIKM", family: "unit", mode: "miles-to-km" }),
  converter({ slug: "kilometers-to-miles", name: "Kilometers to Miles Converter", description: "Convert kilometers into miles.", category: "Converter", icon: "KMMI", family: "unit", mode: "km-to-miles" }),
  converter({ slug: "celsius-to-fahrenheit", name: "Celsius to Fahrenheit Converter", description: "Convert temperatures from Celsius to Fahrenheit.", category: "Converter", icon: "C2F", family: "unit", mode: "c-to-f" }),
  converter({ slug: "fahrenheit-to-celsius", name: "Fahrenheit to Celsius Converter", description: "Convert temperatures from Fahrenheit to Celsius.", category: "Converter", icon: "F2C", family: "unit", mode: "f-to-c" }),
  converter({ slug: "degrees-to-radians", name: "Degrees to Radians Converter", description: "Convert angle values from degrees to radians.", category: "Converter", icon: "D2R", family: "unit", mode: "deg-to-rad" }),
  converter({ slug: "radians-to-degrees", name: "Radians to Degrees Converter", description: "Convert angle values from radians to degrees.", category: "Converter", icon: "R2D", family: "unit", mode: "rad-to-deg" }),
  converter({ slug: "pounds-to-kilograms", name: "Pounds to Kilograms Converter", description: "Convert pounds into kilograms.", category: "Converter", icon: "LBKG", family: "unit", mode: "lb-to-kg" }),
  converter({ slug: "kilograms-to-pounds", name: "Kilograms to Pounds Converter", description: "Convert kilograms into pounds.", category: "Converter", icon: "KGLB", family: "unit", mode: "kg-to-lb" }),
  converter({ slug: "hex-to-rgb", name: "Hex to RGB Converter", description: "Convert HEX color values into RGB.", category: "Converter", icon: "HEX", family: "unit", mode: "hex-to-rgb" }),
  converter({ slug: "rgb-to-hex", name: "RGB to Hex Converter", description: "Convert RGB values into HEX colors.", category: "Converter", icon: "RGB", family: "unit", mode: "rgb-to-hex" }),
  converter({ slug: "cmyk-to-rgb", name: "CMYK to RGB Converter", description: "Convert CMYK color values into RGB.", category: "Converter", icon: "CMYK", family: "unit", mode: "cmyk-to-rgb" }),
  converter({ slug: "rgb-to-cmyk", name: "RGB to CMYK Converter", description: "Convert RGB values into CMYK.", category: "Converter", icon: "RGB", family: "unit", mode: "rgb-to-cmyk" }),
] as const;

export const EXACT_UTILITY_TOOLS = [
  utility({ slug: "json-prettifier", name: "JSON Prettifier", description: "Format JSON with indentation for easier reading.", category: "Utility", icon: "JSON", family: "code", language: "json", action: "prettify" }),
  utility({ slug: "json-minifier", name: "JSON Minifier", description: "Minify JSON into a compact one-line string.", category: "Utility", icon: "JSON", family: "code", language: "json", action: "minify" }),
  utility({ slug: "json-validator", name: "JSON Validator", description: "Validate whether pasted JSON is syntactically correct.", category: "Utility", icon: "JSON", family: "code", language: "json", action: "validate" }),
  utility({ slug: "js-prettifier", name: "JS Prettifier", description: "Format JavaScript code for easier reading and cleanup.", category: "Utility", icon: "JS", family: "code", language: "javascript", action: "prettify" }),
  utility({ slug: "js-minifier", name: "JS Minifier", description: "Minify JavaScript code into a compact output string.", category: "Utility", icon: "JS", family: "code", language: "javascript", action: "minify" }),
  utility({ slug: "js-validator", name: "JS Validator", description: "Validate whether pasted JavaScript parses correctly.", category: "Utility", icon: "JS", family: "code", language: "javascript", action: "validate" }),
  utility({ slug: "html-prettifier", name: "HTML Prettifier", description: "Format HTML markup with readable indentation.", category: "Utility", icon: "HTML", family: "code", language: "html", action: "prettify" }),
  utility({ slug: "html-minifier", name: "HTML Minifier", description: "Minify HTML output by collapsing extra whitespace and comments.", category: "Utility", icon: "HTML", family: "code", language: "html", action: "minify" }),
  utility({ slug: "css-prettify", name: "CSS Prettify", description: "Format CSS with readable indentation.", category: "Utility", icon: "CSS", family: "code", language: "css", action: "prettify" }),
  utility({ slug: "css-minifier", name: "CSS Minifier", description: "Minify CSS output into a compact string.", category: "Utility", icon: "CSS", family: "code", language: "css", action: "minify" }),
  utility({ slug: "xml-prettifier", name: "XML Prettifier", description: "Format XML with readable indentation.", category: "Utility", icon: "XML", family: "code", language: "xml", action: "prettify" }),
  utility({ slug: "xml-minifier", name: "XML Minifier", description: "Minify XML by removing extra whitespace between tags.", category: "Utility", icon: "XML", family: "code", language: "xml", action: "minify" }),
  utility({ slug: "random-password-generator", name: "Random Password Generator", description: "Generate a random password in one click.", category: "Utility", icon: "PASS", family: "random", mode: "password" }),
  utility({ slug: "random-string-generator", name: "Random String Generator", description: "Generate a random alphanumeric string.", category: "Utility", icon: "STR", family: "random", mode: "string" }),
  utility({ slug: "random-number-generator", name: "Random Number Generator", description: "Generate a random number between two values.", category: "Utility", icon: "NUM", family: "random", mode: "number" }),
  utility({ slug: "random-uuid-generator", name: "Random UUID Generator", description: "Generate a random UUID instantly.", category: "Utility", icon: "UUID", family: "random", mode: "uuid" }),
  utility({ slug: "random-date-generator", name: "Random Date Generator", description: "Generate a random date in ISO format.", category: "Utility", icon: "DATE", family: "random", mode: "date" }),
  utility({ slug: "random-time-generator", name: "Random Time Generator", description: "Generate a random time value.", category: "Utility", icon: "TIME", family: "random", mode: "time" }),
  utility({ slug: "random-element-picker", name: "Random Element Picker", description: "Pick one random item from a pasted list.", category: "Utility", icon: "PICK", family: "random", mode: "pick-item" }),
] as const;

export const EXACT_TEXT_TOOL_MAP = Object.fromEntries(EXACT_TEXT_TOOLS.map((tool) => [tool.slug, tool])) as Record<string, ExactTextTool>;
export const EXACT_CONVERTER_TOOL_MAP = Object.fromEntries(EXACT_CONVERTER_TOOLS.map((tool) => [tool.slug, tool])) as Record<string, ExactConverterTool>;
export const EXACT_UTILITY_TOOL_MAP = Object.fromEntries(EXACT_UTILITY_TOOLS.map((tool) => [tool.slug, tool])) as Record<string, ExactUtilityTool>;

export const EXACT_TOOL_REGISTRY: FreeToolMeta[] = [
  ...EXACT_TEXT_TOOLS.map((tool) => ({ name: tool.name, href: `/text/${tool.slug}`, description: tool.description, category: tool.category, icon: tool.icon })),
  ...EXACT_CONVERTER_TOOLS.map((tool) => ({ name: tool.name, href: `/converter/${tool.slug}`, description: tool.description, category: tool.category, icon: tool.icon })),
  ...EXACT_UTILITY_TOOLS.map((tool) => ({ name: tool.name, href: `/utility/${tool.slug}`, description: tool.description, category: tool.category, icon: tool.icon })),
];
