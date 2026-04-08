export type ReverseTextMode = "full" | "word-order" | "mirror-words";

export interface ReverseTextResult {
  output: string;
  inputCharacters: number;
  outputCharacters: number;
  words: number;
  lines: number;
}

function reverseCharacters(text: string) {
  return Array.from(text).reverse().join("");
}

function reverseWordOrder(text: string) {
  const normalized = text.trim();

  if (!normalized) {
    return "";
  }

  return normalized.split(/\s+/).reverse().join(" ");
}

function reverseWordsIndividually(text: string) {
  return text
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : reverseCharacters(part)))
    .join("");
}

function countWords(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

function countLines(text: string) {
  if (!text) {
    return 0;
  }

  return text.split(/\r?\n/).length;
}

export function reverseText(text: string, mode: ReverseTextMode): ReverseTextResult {
  let output = text;

  switch (mode) {
    case "full":
      output = reverseCharacters(text);
      break;
    case "word-order":
      output = reverseWordOrder(text);
      break;
    case "mirror-words":
      output = reverseWordsIndividually(text);
      break;
    default:
      output = text;
  }

  return {
    output,
    inputCharacters: text.length,
    outputCharacters: output.length,
    words: countWords(text),
    lines: countLines(text),
  };
}
