export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "seo-title"
  | "apa-title"
  | "sentence"
  | "camel"
  | "pascal"
  | "kebab"
  | "snake"
  | "constant"
  | "dot"
  | "path"
  | "alternating"
  | "inverse";

export type CaseConversionOptions = {
  preserveFormatting?: boolean;
  lineByLine?: boolean;
};

const SMALL_TITLE_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "vs",
  "via",
  "with",
]);

function normalizeWords(text: string) {
  return text
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_./-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function capitalize(word: string) {
  if (!word) {
    return "";
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function shouldLowercaseTitleWord(word: string, index: number, words: string[]) {
  if (index === 0 || index === words.length - 1) {
    return false;
  }

  return SMALL_TITLE_WORDS.has(word.toLowerCase());
}

function titleCaseWord(word: string, index: number, words: string[], smart: boolean) {
  const lower = word.toLowerCase();

  if (smart && shouldLowercaseTitleWord(lower, index, words)) {
    return lower;
  }

  return capitalize(lower);
}

function titleCasePreservingText(text: string, smart: boolean) {
  const matches = [...text.matchAll(/\b[\p{L}\p{N}'-]+\b/gu)];
  let wordIndex = 0;

  return text.replace(/\b[\p{L}\p{N}'-]+\b/gu, (word) => {
    const result = titleCaseWord(word, wordIndex, matches.map((match) => match[0]), smart);
    wordIndex += 1;
    return result;
  });
}

export function toUpperCaseText(text: string) {
  return text.toUpperCase();
}

export function toLowerCaseText(text: string) {
  return text.toLowerCase();
}

export function toTitleCase(text: string, preserveFormatting = false) {
  if (preserveFormatting) {
    return titleCasePreservingText(text, false);
  }

  return normalizeWords(text).map(capitalize).join(" ");
}

export function toSmartTitleCase(text: string, preserveFormatting = false) {
  if (preserveFormatting) {
    return titleCasePreservingText(text, true);
  }

  const words = normalizeWords(text);
  return words.map((word, index) => titleCaseWord(word, index, words, true)).join(" ");
}

export function toSentenceCase(text: string, preserveFormatting = false) {
  const lower = text.toLowerCase();

  if (!lower.trim()) {
    return "";
  }

  const converted = lower.replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase());

  return preserveFormatting ? converted : converted.replace(/\s+/g, " ").trim();
}

export function toCamelCase(text: string) {
  const words = normalizeWords(text).map((word) => word.toLowerCase());

  if (!words.length) {
    return "";
  }

  return words[0] + words.slice(1).map(capitalize).join("");
}

export function toPascalCase(text: string) {
  return normalizeWords(text).map(capitalize).join("");
}

export function toKebabCase(text: string) {
  return normalizeWords(text).map((word) => word.toLowerCase()).join("-");
}

export function toSnakeCase(text: string) {
  return normalizeWords(text).map((word) => word.toLowerCase()).join("_");
}

export function toConstantCase(text: string) {
  return normalizeWords(text).map((word) => word.toUpperCase()).join("_");
}

export function toDotCase(text: string) {
  return normalizeWords(text).map((word) => word.toLowerCase()).join(".");
}

export function toPathCase(text: string) {
  return normalizeWords(text).map((word) => word.toLowerCase()).join("/");
}

export function toAlternatingCase(text: string) {
  let letterIndex = 0;

  return text.replace(/\p{L}/gu, (letter) => {
    const converted = letterIndex % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase();
    letterIndex += 1;
    return converted;
  });
}

export function toInverseCase(text: string) {
  return [...text]
    .map((character) => {
      const upper = character.toUpperCase();
      const lower = character.toLowerCase();

      if (character === upper && character !== lower) {
        return lower;
      }

      if (character === lower && character !== upper) {
        return upper;
      }

      return character;
    })
    .join("");
}

function convertSingleBlock(text: string, mode: CaseMode, options: CaseConversionOptions) {
  switch (mode) {
    case "upper":
      return toUpperCaseText(text);
    case "lower":
      return toLowerCaseText(text);
    case "title":
      return toTitleCase(text, options.preserveFormatting);
    case "seo-title":
    case "apa-title":
      return toSmartTitleCase(text, options.preserveFormatting);
    case "sentence":
      return toSentenceCase(text, options.preserveFormatting);
    case "camel":
      return toCamelCase(text);
    case "pascal":
      return toPascalCase(text);
    case "kebab":
      return toKebabCase(text);
    case "snake":
      return toSnakeCase(text);
    case "constant":
      return toConstantCase(text);
    case "dot":
      return toDotCase(text);
    case "path":
      return toPathCase(text);
    case "alternating":
      return toAlternatingCase(text);
    case "inverse":
      return toInverseCase(text);
    default:
      return text;
  }
}

export function convertCase(text: string, mode: CaseMode, options: CaseConversionOptions = {}) {
  if (options.lineByLine && text.includes("\n")) {
    return text
      .split(/\r?\n/)
      .map((line) => convertSingleBlock(line, mode, { ...options, lineByLine: false }))
      .join("\n");
  }

  return convertSingleBlock(text, mode, options);
}
