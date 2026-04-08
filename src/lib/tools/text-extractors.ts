export type ExtractorMode = "email" | "url" | "number";

const extractorPatterns: Record<ExtractorMode, RegExp> = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  url: /\bhttps?:\/\/[^\s<>"']+|\bwww\.[^\s<>"']+/gi,
  number: /[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g,
};

export function extractValues(text: string, mode: ExtractorMode, uniqueOnly: boolean) {
  const pattern = extractorPatterns[mode];
  const matches = text.match(pattern) ?? [];
  const values = uniqueOnly ? [...new Set(matches)] : matches;

  return {
    values,
    totalMatches: matches.length,
    uniqueMatches: [...new Set(matches)].length,
    output: values.join("\n"),
  };
}
