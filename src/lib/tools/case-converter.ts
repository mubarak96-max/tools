export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "kebab"
  | "snake";

function normalizeWords(text: string) {
  return text
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
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

export function toUpperCaseText(text: string) {
  return text.toUpperCase();
}

export function toLowerCaseText(text: string) {
  return text.toLowerCase();
}

export function toTitleCase(text: string) {
  return normalizeWords(text).map(capitalize).join(" ");
}

export function toSentenceCase(text: string) {
  const lower = text.toLowerCase().trim();

  if (!lower) {
    return "";
  }

  return lower
    .replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
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

export function convertCase(text: string, mode: CaseMode) {
  switch (mode) {
    case "upper":
      return toUpperCaseText(text);
    case "lower":
      return toLowerCaseText(text);
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camel":
      return toCamelCase(text);
    case "pascal":
      return toPascalCase(text);
    case "kebab":
      return toKebabCase(text);
    case "snake":
      return toSnakeCase(text);
    default:
      return text;
  }
}
