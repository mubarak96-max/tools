import type { BackslashMode, TextCleanerOptions, WhitespaceMode } from "@/lib/tools/text-cleaner";
import type { SortMode, SortScope } from "@/lib/tools/line-tools";
import type { TextAlignMode } from "@/lib/tools/text-aligner";
import type { ExtractorMode } from "@/lib/tools/text-extractors";
import type { EncodingMode } from "@/lib/tools/encoding-tools";
import type { DataFormat } from "@/lib/tools/data-format-converter";
import type { TimeMode } from "@/lib/tools/time-converter";
import type { UnitMode } from "@/lib/tools/unit-converter";
import type { CodeAction, CodeLanguage } from "@/lib/tools/code-formatters";
import type { RandomMode } from "@/lib/tools/random-generators";
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
      focus: "overview" | "phrases" | "longest" | "shortest";
    });

export type ExactConverterTool =
  | (BaseTool & { family: "encoding"; mode: EncodingMode })
  | (BaseTool & { family: "data"; from: DataFormat; to: DataFormat })
  | (BaseTool & { family: "time"; mode: TimeMode })
  | (BaseTool & { family: "unit"; mode: UnitMode });

export type ExactUtilityTool =
  | (BaseTool & { family: "code"; language: CodeLanguage; action: CodeAction })
  | (BaseTool & { family: "random"; mode: RandomMode });

const text = (tool: ExactTextTool): ExactTextTool => tool;
const converter = (tool: ExactConverterTool): ExactConverterTool => tool;
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
  text({ slug: "spaces-to-tabs", name: "Spaces to Tabs Converter", description: "Convert repeated spaces into tab characters for quick text cleanup.", category: "Text", icon: "S2T", family: "cleaner", preset: { whitespaceMode: "spaces-to-tabs" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "tabs-to-spaces", name: "Tabs to Spaces Converter", description: "Replace tab characters with spaces in copied code and plain text.", category: "Text", icon: "T2S", family: "cleaner", preset: { whitespaceMode: "tabs-to-spaces" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "spaces-to-newlines", name: "Spaces to Newlines Converter", description: "Turn space-separated text into newline-separated text in one pass.", category: "Text", icon: "S2N", family: "cleaner", preset: { whitespaceMode: "spaces-to-newlines" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
  text({ slug: "newlines-to-spaces", name: "Newlines to Spaces Converter", description: "Flatten multiline text into one space-separated line.", category: "Text", icon: "N2S", family: "cleaner", preset: { whitespaceMode: "newlines-to-spaces" as WhitespaceMode }, lockedKeys: ["whitespaceMode"], hiddenKeys: ["backslashMode", "trimLines", "removeEmptyLines", "collapseSpaces", "removeAllWhitespace", "removePunctuation", "removeAccents"] }),
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
] as const;

export const EXACT_CONVERTER_TOOLS = [
  converter({ slug: "url-encoder", name: "URL Encoder", description: "Encode text for safe use in URLs and query strings.", category: "Converter", icon: "URL", family: "encoding", mode: "url-encode" }),
  converter({ slug: "url-decoder", name: "URL Decoder", description: "Decode percent-encoded URLs and query-string values.", category: "Converter", icon: "URL", family: "encoding", mode: "url-decode" }),
  converter({ slug: "html-encoder", name: "HTML Encoder", description: "Convert special characters into HTML-safe entities.", category: "Converter", icon: "HTML", family: "encoding", mode: "html-encode" }),
  converter({ slug: "html-decoder", name: "HTML Decoder", description: "Decode HTML entities back into readable characters.", category: "Converter", icon: "HTML", family: "encoding", mode: "html-decode" }),
  converter({ slug: "base64-encoder", name: "Base64 Encoder", description: "Encode plain text into Base64.", category: "Converter", icon: "B64", family: "encoding", mode: "base64-encode" }),
  converter({ slug: "base64-decoder", name: "Base64 Decoder", description: "Decode Base64 into plain text.", category: "Converter", icon: "B64", family: "encoding", mode: "base64-decode" }),
  converter({ slug: "rot13-encoder-decoder", name: "ROT13 Encoder/Decoder", description: "Rotate alphabetic characters by 13 positions in either direction.", category: "Converter", icon: "ROT13", family: "encoding", mode: "rot13" }),
  converter({ slug: "rot47-encoder-decoder", name: "ROT47 Encoder/Decoder", description: "Rotate printable ASCII characters with the ROT47 cipher.", category: "Converter", icon: "ROT47", family: "encoding", mode: "rot47" }),
  converter({ slug: "text-to-binary", name: "Text to Binary Converter", description: "Convert text characters into 8-bit binary values.", category: "Converter", icon: "BIN", family: "encoding", mode: "text-to-binary" }),
  converter({ slug: "binary-to-text", name: "Binary to Text Converter", description: "Convert 8-bit binary values back into text.", category: "Converter", icon: "BIN", family: "encoding", mode: "binary-to-text" }),
  converter({ slug: "text-to-hex", name: "Text to Hex Converter", description: "Convert text into hexadecimal byte values.", category: "Converter", icon: "HEX", family: "encoding", mode: "text-to-hex" }),
  converter({ slug: "hex-to-text", name: "Hex to Text Converter", description: "Convert hexadecimal byte values into readable text.", category: "Converter", icon: "HEX", family: "encoding", mode: "hex-to-text" }),
  converter({ slug: "text-to-octal", name: "Text to Octal Converter", description: "Convert text into octal byte values.", category: "Converter", icon: "OCT", family: "encoding", mode: "text-to-octal" }),
  converter({ slug: "octal-to-text", name: "Octal to Text Converter", description: "Convert octal byte values into text.", category: "Converter", icon: "OCT", family: "encoding", mode: "octal-to-text" }),
  converter({ slug: "text-to-decimal", name: "Text to Decimal Converter", description: "Convert text into decimal character codes.", category: "Converter", icon: "DEC", family: "encoding", mode: "text-to-decimal" }),
  converter({ slug: "decimal-to-text", name: "Decimal to Text Converter", description: "Convert decimal character codes back into text.", category: "Converter", icon: "DEC", family: "encoding", mode: "decimal-to-text" }),
  converter({ slug: "punycode-encoder", name: "Punycode Encoder", description: "Encode Unicode text into punycode.", category: "Converter", icon: "PUNY", family: "encoding", mode: "punycode-encode" }),
  converter({ slug: "punycode-decoder", name: "Punycode Decoder", description: "Decode punycode back into readable Unicode text.", category: "Converter", icon: "PUNY", family: "encoding", mode: "punycode-decode" }),
  converter({ slug: "idn-encoder", name: "IDN Encoder", description: "Convert internationalized domain names into ASCII form.", category: "Converter", icon: "IDN", family: "encoding", mode: "idn-encode" }),
  converter({ slug: "idn-decoder", name: "IDN Decoder", description: "Decode ASCII IDN values into readable Unicode domains.", category: "Converter", icon: "IDN", family: "encoding", mode: "idn-decode" }),
  converter({ slug: "json-to-csv", name: "JSON to CSV Converter", description: "Convert JSON into CSV rows for spreadsheet use.", category: "Converter", icon: "JSON", family: "data", from: "json", to: "csv" }),
  converter({ slug: "csv-to-json", name: "CSV to JSON Converter", description: "Convert CSV rows into JSON.", category: "Converter", icon: "CSV", family: "data", from: "csv", to: "json" }),
  converter({ slug: "json-to-yaml", name: "JSON to YAML Converter", description: "Convert JSON into YAML format.", category: "Converter", icon: "YAML", family: "data", from: "json", to: "yaml" }),
  converter({ slug: "yaml-to-json", name: "YAML to JSON Converter", description: "Convert YAML into JSON.", category: "Converter", icon: "YAML", family: "data", from: "yaml", to: "json" }),
  converter({ slug: "json-to-xml", name: "JSON to XML Converter", description: "Convert JSON into XML markup.", category: "Converter", icon: "XML", family: "data", from: "json", to: "xml" }),
  converter({ slug: "xml-to-json", name: "XML to JSON Converter", description: "Convert XML markup into JSON.", category: "Converter", icon: "XML", family: "data", from: "xml", to: "json" }),
  converter({ slug: "xml-to-csv", name: "XML to CSV Converter", description: "Convert XML content into CSV rows.", category: "Converter", icon: "XML", family: "data", from: "xml", to: "csv" }),
  converter({ slug: "csv-to-xml", name: "CSV to XML Converter", description: "Convert CSV rows into XML.", category: "Converter", icon: "CSV", family: "data", from: "csv", to: "xml" }),
  converter({ slug: "xml-to-yaml", name: "XML to YAML Converter", description: "Convert XML into YAML.", category: "Converter", icon: "XML", family: "data", from: "xml", to: "yaml" }),
  converter({ slug: "yaml-to-xml", name: "YAML to XML Converter", description: "Convert YAML into XML.", category: "Converter", icon: "YAML", family: "data", from: "yaml", to: "xml" }),
  converter({ slug: "json-to-text", name: "JSON to Text Converter", description: "Flatten JSON into readable text output.", category: "Converter", icon: "JSON", family: "data", from: "json", to: "text" }),
  converter({ slug: "xml-to-text", name: "XML to Text Converter", description: "Convert XML into readable text output.", category: "Converter", icon: "XML", family: "data", from: "xml", to: "text" }),
  converter({ slug: "html-to-markdown", name: "HTML to Markdown Converter", description: "Convert HTML markup into Markdown.", category: "Converter", icon: "MD", family: "data", from: "html", to: "markdown" }),
  converter({ slug: "markdown-to-html", name: "Markdown to HTML Converter", description: "Convert Markdown into HTML.", category: "Converter", icon: "MD", family: "data", from: "markdown", to: "html" }),
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
